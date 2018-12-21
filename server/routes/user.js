import { Controller, Post } from '../lib/decorator';

import { checkPassword } from '../service/user';

@Controller('/admin')
export default class userController {
  @Post('/login')
  async login(ctx, next) {
    let { username, password } = ctx.request.body;
    let matchResult = await checkPassword(username, password);
    if (!matchResult.isMatch) {
      ctx.body = {
        success: false,
        err: '用户名或密码错误'
      };
    } else {
      ctx.session.user = {
        username: username,
        email: password
      };
      ctx.body = {
        success: true,
        data: 'success'
      };
    }
  }
}
