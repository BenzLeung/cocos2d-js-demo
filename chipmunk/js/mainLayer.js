/**
 * @file cocos2d-js 物理引擎 chipmunk 测试 - 主要的层
 * @author BenzLeung(https://github.com/BenzLeung)
 * @date 2017/2/10
 * Created by JetBrains PhpStorm.
 *
 * 每位工程师都有保持代码优雅的义务
 * each engineer has a duty to keep the code elegant
 */

var MainLayer = cc.Layer.extend({

    ctor : function () {
        this._super();

        this.space = new cp.Space();
        this.initPhysics();

        this.scheduleUpdate();

        var me = this;
        setInterval(function () {
            var x = cc.random0To1() * cc.visibleRect.width / 3 * 2 + cc.visibleRect.left.x + 80;
            me.addBox(cc.p(x, 700));
        }, 1000);
    },

    initPhysics : function () {
        // 物理空间
        var space = this.space;

        // 固定不动的物体
        var staticBody = space.staticBody;

        var visibleRect = cc.visibleRect;

        // 墙壁
        var walls = [
            // bottom
            new cp.SegmentShape( staticBody,
                cp.v(visibleRect.bottomLeft.x, visibleRect.bottomLeft.y),
                cp.v(visibleRect.bottomRight.x, visibleRect.bottomRight.y),
                0),
            // top
            new cp.SegmentShape( staticBody,
                cp.v(visibleRect.topLeft.x, visibleRect.topLeft.y),
                cp.v(visibleRect.topRight.x, visibleRect.topRight.y),
                0),
            // left
            new cp.SegmentShape( staticBody,
                cp.v(visibleRect.topLeft.x, visibleRect.topLeft.y),
                cp.v(visibleRect.bottomLeft.x, visibleRect.bottomLeft.y),
                0),
            // right
            new cp.SegmentShape( staticBody,
                cp.v(visibleRect.topRight.x, visibleRect.topRight.y),
                cp.v(visibleRect.bottomRight.x, visibleRect.bottomRight.y),
                0)
        ];
        for( var i=0; i < walls.length; i++ ) {
            var wall = walls[i];
            // 弹性
            wall.setElasticity(1);
            // 摩擦力
            wall.setFriction(1);
            // 加入固定不动的物体（墙）到物理空间
            space.addStaticShape(wall);
        }

        // 重力向下
        space.gravity = cp.v(0, -300);
    },

    // 添加一个方形
    addBox: function (pos) {
        // cocos 的物理引擎专用 sprite
        var sprite = new cc.PhysicsSprite('res/box-blue.png');
        var size = sprite.getContentSize();

        // 创建物体
        // momentForBox() 设定惯性值
        // cp.momentForBox 函数是计算多边形的惯性值，
        // 它的第一个参数是惯性力矩。
        // 惯性力矩，也叫“MOI”，是Moment Of Inertia的缩写，
        // 惯性力矩是用来判断一个物体在受到力矩作用时，容不容易绕着中心轴转动的数值。
        // 然后是物体的宽和高。
        var body = new cp.Body(1, cp.momentForBox(1, size.width, size.height));
        body.setPos(pos);
        this.space.addBody(body);

        // cocos 的 sprite 关联到 chipmunk 的物体
        sprite.setBody(body);

        // 创建形状(Box)
        var shape = new cp.BoxShape(body, size.width, size.height);
        // 弹性
        shape.setElasticity(1);
        // 摩擦力
        shape.setFriction(0.5);
        // 加入到物理空间
        this.space.addShape(shape);

        this.addChild(sprite);
    },

    update: function (dt) {
        this._super(dt);
        // chipmunk step
        this.space.step(dt);
    }
});