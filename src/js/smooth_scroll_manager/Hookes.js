//const Force3 = require('../common/force3').default;
const glMatrix = require('gl-matrix');

const Force3 = {
  updateVelocity: (velocity, acceleration, mass) => {
    glMatrix.vec3.scale(acceleration, acceleration, 1 / mass);
    glMatrix.vec3.add(velocity, velocity, acceleration);
  },
  applyFriction: (acceleration, mu, n) => {
    const friction = [0, 0, 0];
    glMatrix.vec3.scale(friction, acceleration, -1);
    const normal = (n) ? n : 1;
    glMatrix.vec3.normalize(friction, friction);
    glMatrix.vec3.scale(friction, friction, mu);
    glMatrix.vec3.add(acceleration, acceleration, friction);
  },
  applyDrag: (acceleration, value) => {
    const drag = [0, 0, 0];
    glMatrix.vec3.scale(drag, acceleration, -1);
    glMatrix.vec3.normalize(drag, drag);
    glMatrix.vec3.scale(drag, drag, glMatrix.vec3.length(acceleration) * value);
    glMatrix.vec3.add(acceleration, acceleration, drag);
  },
  applyHook: (velocity, acceleration, anchor, rest_length, k) => {
    const hook = [0, 0, 0];
    glMatrix.vec3.sub(hook, velocity, anchor);
    const distance = glMatrix.vec3.length(hook) - rest_length;
    glMatrix.vec3.normalize(hook, hook);
    glMatrix.vec3.scale(hook, hook, -1 * k * distance);
    glMatrix.vec3.add(acceleration, acceleration, hook);
  }
}


export default class Hookes {
  constructor(opt) {
    this.velocity = [0, 0, 0];
    this.acceleration = [0, 0, 0];
    this.anchor = [0, 0, 0];
    this.k = (opt && opt.k !== undefined) ? opt.k : 0.3;
    this.d = (opt && opt.d !== undefined) ? opt.d : 0.7;
    this.m = (opt && opt.m !== undefined) ? opt.m : 1;
  }
  render() {
    Force3.applyHook(this.velocity, this.acceleration, this.anchor, 0, this.k);
    Force3.applyDrag(this.acceleration, this.d);
    Force3.updateVelocity(this.velocity, this.acceleration, this.m);
  }
}
