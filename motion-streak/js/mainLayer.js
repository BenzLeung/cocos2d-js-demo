/**
 * @file cocos2d-js 拖尾特效测试 - 主要的层
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

        this.star = new cc.Sprite('res/star.png');

        // fade         : 拖尾渐隐时间（秒）
        // minSeg       : 最小的片段长度（渐隐片段的大小）。拖尾条带相连顶点间的最小距离。
        // stroke       : 渐隐条带的宽度。
        // color        : 片段颜色值。
        // texture/path : 纹理图片文件。
        this.streak = new cc.MotionStreak(0.5, 1, 15, cc.color(255, 255, 255), 'res/streak.png');
        this.addChild(this.streak, 1);

        var winSize = cc.director.getWinSize();
        this.star.setPosition(winSize.width / 2, winSize.height / 2);
        this.streak.setPosition(winSize.width / 2, winSize.height / 2);

        this.addChild(this.star, 2);

        this.initMouseAndTouch();
    },

    initMouseAndTouch : function () {
        var me = this;
        var processEvent = function (event) {
            var pos = event.getLocation();
            me.star.setPosition(pos.x - cc.visibleRect.left.x, pos.y - cc.visibleRect.bottom.y);
            me.streak.setPosition(pos.x - cc.visibleRect.left.x, pos.y - cc.visibleRect.bottom.y);
        };
        var mouseListener = cc.EventListener.create({
            event: cc.EventListener.MOUSE,
            onMouseDown: function (event) {
                if (event.getButton() == cc.EventMouse.BUTTON_LEFT) {
                    me.streak.reset();
                    processEvent(event);
                }
            },
            onMouseMove: function (event) {
                if (event.getButton() == cc.EventMouse.BUTTON_LEFT) {
                    processEvent(event);
                }
            }
        });
        cc.eventManager.addListener(mouseListener, this);
        var touchListener = cc.EventListener.create({
            prevTouchId: -1,
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
            onTouchesMoved:function (touches, event) {
                var touch = touches[0];
                if (this.prevTouchId != touch.getID()) {
                    this.prevTouchId = touch.getID();
                } else {
                    processEvent(touches[0]);
                }
            }
        });
        cc.eventManager.addListener(touchListener, this);
    }
});