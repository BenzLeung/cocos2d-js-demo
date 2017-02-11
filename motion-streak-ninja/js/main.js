/**
 * @file cocos2d-js 拖尾特效测试 - 入口
 * @author BenzLeung(https://github.com/BenzLeung)
 * @date 2017/2/10
 * Created by JetBrains PhpStorm.
 *
 * 每位工程师都有保持代码优雅的义务
 * each engineer has a duty to keep the code elegant
 */

(function () {

    cc.game.config = {
        "debugMode"     : 1,
        "frameRate"     : 60,
        "showFPS"       : true,
        "id"            : "gameCanvas",
        "renderMode"    : 2  // 拖尾特效似乎只支持 WebGL
    };

    cc.game.onStart = function(){
        if (cc.sys.isMobile) {
            cc.view.setDesignResolutionSize(720, 1280, cc.ResolutionPolicy.NO_BORDER);
        } else {
            cc.view.setDesignResolutionSize(1920, 1080, cc.ResolutionPolicy.NO_BORDER);
        }
        cc.view.setOrientation(cc.ORIENTATION_PORTRAIT);
        cc.view.resizeWithBrowserSize(true);

        cc.LoaderScene.preload(['res/streak.png'], function () {
            var scene = new cc.Scene();
            var winSize = cc.director.getWinSize();
            scene.addChild(new cc.LayerColor(cc.color.BLACK), 1);
            var titleLabel = new cc.LabelTTF('拖尾特效2', 'Microsoft Yahei', 60);
            titleLabel.setPosition(winSize.width / 2, winSize.height / 2 + 100);
            titleLabel.setColor(cc.color(0, 255, 0));
            scene.addChild(titleLabel, 2);
            var introLabel = new cc.LabelTTF('用鼠标或触屏在屏幕上拖拽。\n拖尾特效似乎只支持 WebGL', 'Microsoft Yahei', 40);
            introLabel.setPosition(winSize.width / 2, winSize.height / 2 - 100);
            introLabel.setColor(cc.color(128, 128, 128));
            scene.addChild(introLabel, 2);
            scene.addChild(new MainLayer(), 10);
            cc.director.runScene(scene);
        }, this);
    };

    cc.game.run('gameCanvas');
})();