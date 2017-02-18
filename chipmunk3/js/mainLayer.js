/**
 * @file cocos2d-js 物理引擎 chipmunk 测试 - 主要的层
 * @author BenzLeung(https://github.com/BenzLeung)
 * @date 2017/2/10
 * Created by JetBrains PhpStorm.
 *
 * 每位工程师都有保持代码优雅的义务
 * each engineer has a duty to keep the code elegant
 */


var MOVE_FRICTION = 1.0;
var MOVE_FRICTION_SQ = MOVE_FRICTION * MOVE_FRICTION;
var ROTATE_FRICTION = Math.PI * 2 / 360;

var MainLayer = cc.Layer.extend({

    WIDTH  : 1400,
    HEIGHT : 700,
    SHOOT_SPEED : 700,
    SHOOT_SPEED_SQ : 490000,

    ctor : function () {
        this._super();

        if (cc.sys.isMobile) {
            this.WIDTH = 600;
            this.HEIGHT = 1200;
        }

        var winSize = cc.director.getWinSize();

        this.setContentSize(this.WIDTH, this.HEIGHT);
        this.ignoreAnchorPointForPosition(false);
        this.setAnchorPoint(0.5, 0.5);
        this.setPosition(winSize.width / 2, winSize.height / 2);

        this.space = new cp.Space();
        this.initSpace();

        this.initMouse();
        if (cc.sys.capabilities['touches']) {
            this.initTouch();
        }

        this.scheduleUpdate();

        this.masterBallOriginPos = cc.p(this.WIDTH * 3 / 4, this.HEIGHT / 2);
        if (cc.sys.isMobile) {
            this.masterBallOriginPos = cc.p(this.WIDTH / 2, this.HEIGHT / 4);
        }
        this.masterBall = this.addBall(this.masterBallOriginPos, cp.vzero, 'res/masterball.png');

        var me = this;
        var t = setInterval(function () {
            me.addBall(cc.p(50, 50), cp.v(cc.random0To1() * 500, cc.random0To1() * 500));
        }, 1000);
        setTimeout(function () {
            clearInterval(t);
        }, 20010);
    },

    initSpace : function () {
        // 物理空间
        var space = this.space;

        // 固定不动的物体
        var staticBody = space.staticBody;

        // 墙壁
        var walls = [
            // bottom
            new cp.SegmentShape( staticBody,
                cp.v(0, 0),
                cp.v(this.WIDTH, 0),
                1),
            // top
            new cp.SegmentShape( staticBody,
                cp.v(0, this.HEIGHT),
                cp.v(this.WIDTH, this.HEIGHT),
                1),
            // left
            new cp.SegmentShape( staticBody,
                cp.v(0, 0),
                cp.v(0, this.HEIGHT),
                1),
            // right
            new cp.SegmentShape( staticBody,
                cp.v(this.WIDTH, 0),
                cp.v(this.WIDTH, this.HEIGHT),
                1)
        ];
        for( var i=0; i < walls.length; i++ ) {
            var wall = walls[i];
            // 弹性
            wall.setElasticity(1);
            // 摩擦力
            wall.setFriction(0.1);
            // 加入固定不动的物体（墙）到物理空间
            space.addStaticShape(wall);
        }

        // 没有重力
        space.gravity = cp.v(0, 0);

        // 创建矩形桌面
        var desktop = new cp.BoxShape2(staticBody, new cp.BB(0, 0, this.WIDTH, this.HEIGHT));
        desktop.setElasticity(0);
        desktop.setFriction(0);
        desktop.setSensor(true);
        desktop.setCollisionType(1);
        space.addStaticShape(desktop);

        this._debugNode = new cc.PhysicsDebugNode(this.space);
        this.addChild(this._debugNode);
    },

    initMouse: function () {
        var me = this;
        var mouseListener = cc.EventListener.create({
            event: cc.EventListener.MOUSE,
            onMouseUp: function (event) {
                if (event.getButton() == cc.EventMouse.BUTTON_LEFT) {
                    var loc = event.getLocation();
                    var bb = me.getBoundingBoxToWorld();
                    loc.x -= bb.x;
                    loc.y -= bb.y;
                    me.shootMasterBall(loc);
                }
            }
        });
        cc.eventManager.addListener(mouseListener, this);
    },

    initTouch: function () {
        var me = this;
        var touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function (event) {
                var loc = event.getLocation();
                var bb = me.getBoundingBoxToWorld();
                loc.x -= bb.x;
                loc.y -= bb.y;
                me.shootMasterBall(loc);
            }
        });
        cc.eventManager.addListener(touchListener, this);
    },

    desktopPreSolve: function (arbiter, space) {
        var shapes = arbiter.getShapes();
        var desktop = shapes[0];
        var ball = shapes[1];
        var ballBody = ball.getBody();

        var vx = ballBody.vx;
        var vy = ballBody.vy;
        var w = ballBody.w;
        if (vx === 0 && vy === 0 && w === 0) {
            return false;
        }

        /*/////////////
            (i*x)^2 + (i*y)^2 = F^2
        ->  i^2 * x^2 + i^2 * y^2 = F^2
        ->  i^2 * (x^2 + y^2) = F^2
        ->  i^2 = F^2 / (x^2 + y^2)
        /////////////*/
        var m_sq = MOVE_FRICTION_SQ / (vx * vx + vy * vy);
        var m = Math.sqrt(m_sq);

        if (m > 1) {
            ballBody.vx = 0;
            ballBody.vy = 0;
        } else {
            ballBody.vx = vx - m * vx;
            ballBody.vy = vy - m * vy;
        }

        if (Math.abs(w) > ROTATE_FRICTION) {
            if (w > 0) {
                ballBody.w -= ROTATE_FRICTION;
            } else {
                ballBody.w += ROTATE_FRICTION;
            }
        } else {
            ballBody.w = 0;
        }

        return false;
    },

    onEnter: function() {
        this._super();
        this.space.addCollisionHandler(1, 0, null, this.desktopPreSolve, null, null);
    },

    onExit: function() {
        this.space.removeCollisionHandler(1, 0);
        this._super();
    },

    addBall: function (pos, vel, pngName) {
        pngName = pngName || 'res/ball.png';
        var sprite = new Ball(pngName);
        sprite.setPosition(pos);
        sprite.body.setVel(vel);
        this.space.addBody(sprite.body);
        this.space.addShape(sprite.shape);
        this.addChild(sprite);

        return sprite;
    },

    shootMasterBall: function (pos) {
        var curPos = this.masterBall.getPosition();
        var dx = pos.x - curPos.x;
        var dy = pos.y - curPos.y;
        if (dx === 0 && dy === 0) {
            return;
        }

        var m_sq = this.SHOOT_SPEED_SQ / (dx * dx + dy * dy);
        var m = Math.sqrt(m_sq);
        var v = new cp.Vect(m * dx, m * dy);

        this.masterBall.body.setVel(v);
    },

    update: function (dt) {
        this._super(dt);
        // chipmunk step
        var l = Math.round(60 / (1 / dt));
        if (l < 1) {
            l = 1;
        }
        for (var i = 0; i < l; i ++) {
            this.space.step(1 / 60);
        }
        /*var s_dt = dt;
        var l = 1;
        while (s_dt > 0.017) {
            s_dt /= 2;
            l *= 2;
        }
        for (var i = 0; i < l; i ++) {
            this.space.step(dt);
        }*/
    }
});