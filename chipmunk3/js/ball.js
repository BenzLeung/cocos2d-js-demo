/**
 * @file 球
 * @author BenzLeung(https://github.com/BenzLeung)
 * @date 2017/2/18
 * Created by JetBrains PhpStorm.
 *
 * 每位工程师都有保持代码优雅的义务
 * each engineer has a duty to keep the code elegant
 */
var Ball = cc.PhysicsSprite.extend({
    // 球与桌面的摩擦力系数
    friction: 1.0,
    frictionSQ: 1.0,
    ctor: function (fileName) {
        this._super(fileName);

        var radius = this.getBoundingBox().width / 2;

        this.body = new cp.Body(1, cp.momentForCircle(1, 0, radius, cp.vzero));
        this.body.sprite = this;
        this.setBody(this.body);

        this.shape = new cp.CircleShape(this.body, radius, cp.vzero);
        this.shape.setElasticity(1);
        this.shape.setFriction(0.3);
    }
});