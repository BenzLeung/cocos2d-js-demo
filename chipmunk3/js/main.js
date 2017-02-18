/**
 * @file cocos2d-js 物理引擎 chipmunk 测试 - 入口
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
        "renderMode"    : 0
    };

    cc.game.onStart = function(){
        if (cc.sys.isMobile) {
            cc.view.setDesignResolutionSize(720, 1280, cc.ResolutionPolicy.SHOW_ALL);
        } else {
            cc.view.setDesignResolutionSize(1920, 1080, cc.ResolutionPolicy.SHOW_ALL);
        }
        cc.view.setOrientation(cc.ORIENTATION_PORTRAIT);
        cc.view.resizeWithBrowserSize(true);

        cc.LoaderScene.preload(['res/ball.png', 'res/masterball.png'], function () {
            var scene = new cc.Scene();
            var winSize = cc.director.getWinSize();
            scene.addChild(new cc.LayerColor(cc.color.BLACK), 1);
            var titleLabel = new cc.LabelTTF('物理引擎 chipmunk - 3', 'Microsoft Yahei', 60);
            titleLabel.setPosition(cc.visibleRect.width / 2 + cc.visibleRect.left.x, winSize.height / 2 + 100);
            titleLabel.setColor(cc.color(0, 255, 0));
            scene.addChild(titleLabel, 2);
            scene.addChild(new MainLayer(), 10);
            cc.director.runScene(scene);
        }, this);
    };

    cc.game.run('gameCanvas');
})();