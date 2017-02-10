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
        "renderMode"    : 2  // 拖尾特效只支持 WebGL
    };

    cc.game.onStart = function(){
        if (cc.sys.isMobile) {
            cc.view.setDesignResolutionSize(720, 1280, cc.ResolutionPolicy.NO_BORDER);
        } else {
            cc.view.setDesignResolutionSize(1920, 1080, cc.ResolutionPolicy.NO_BORDER);
        }
        cc.view.setOrientation(cc.ORIENTATION_PORTRAIT);
        cc.view.resizeWithBrowserSize(true);

        cc.LoaderScene.preload(['res/star.png', 'res/streak.png'], function () {
            var scene = new cc.Scene();
            scene.addChild(new cc.LayerColor(cc.color.BLACK), 1);

            scene.addChild(new MainLayer(), 2);
            cc.director.runScene(scene);
        }, this);
    };

    cc.game.run('gameCanvas');
})();