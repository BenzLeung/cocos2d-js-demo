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

        this.streakSetting = {};
        // fade         : 拖尾渐隐时间（秒）
        this.streakSetting.fade = 1;
        // minSeg       : 最小的片段长度（渐隐片段的大小）。拖尾条带相连顶点间的最小距离。
        this.streakSetting.minSeg = 1;
        // stroke       : 渐隐条带的宽度。
        this.streakSetting.stroke = 15;
        // color        : 片段颜色值。
        this.streakSetting.color = cc.color(255, 255, 255);
        // texture/path : 纹理图片文件。
        this.streakSetting.texture = 'res/streak.png';

        this.streaks = {};

        this.initMouseAndTouch();
    },

    initMouseAndTouch : function () {
        var me = this;
        var processEvent = function (streak, event) {
            var pos = event.getLocation();
            streak.setPosition(pos.x - cc.visibleRect.left.x, pos.y - cc.visibleRect.bottom.y);
        };

        var mouseListener = cc.EventListener.create({
            streakId: 0,
            event: cc.EventListener.MOUSE,
            onMouseDown: function (event) {
                if (event.getButton() == cc.EventMouse.BUTTON_LEFT) {
                    this.streakId ++;
                    var s = me.streakSetting;
                    me.streaks[this.streakId] = new cc.MotionStreak(s.fade, s.minSeg, s.stroke, s.color, s.texture);
                    me.addChild(me.streaks[this.streakId], 1);
                    processEvent(me.streaks[this.streakId], event);
                }
            },
            onMouseMove: function (event) {
                if (event.getButton() == cc.EventMouse.BUTTON_LEFT) {
                    processEvent(me.streaks[this.streakId], event);
                }
            },
            onMouseUp: function () {
                var id = this.streakId;
                var st = me.streaks[this.streakId];
                setTimeout(function () {
                    st.removeFromParent(true);
                    delete me.streaks[id];
                }, me.streakSetting.fade * 1000);
            }
        });
        cc.eventManager.addListener(mouseListener, this);

        var touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan:function (touch, event) {
                var id = touch.getID();
                var s = me.streakSetting;
                me.streaks[id] = new cc.MotionStreak(s.fade, s.minSeg, s.stroke, s.color, s.texture);
                me.addChild(me.streaks[id], 1);
                processEvent(me.streaks[id], touch);
                return true;
            },
            onTouchMoved:function (touch, event) {
                var id = touch.getID();
                processEvent(me.streaks[id], touch);
            },
            onTouchEnded:function (touch, event) {
                var id = touch.getID();
                var st = me.streaks[id];
                setTimeout(function () {
                    st.removeFromParent(true);
                }, me.streakSetting.fade * 1000);
            },
            onTouchCancelled:function (touch, event) {
                var id = touch.getID();
                var st = me.streaks[id];
                st.removeFromParent(true);
                delete me.streaks[id];
            }
        });
        cc.eventManager.addListener(touchListener, this);
    }
});