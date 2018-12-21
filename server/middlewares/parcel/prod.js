import serve from 'koa-static';
import views from 'koa-views';
import {
    resolve
} from 'path';

const r = path => resolve(__dirname, path);

export const dev = async app => {
    app.use(serve(r('../../../dist')));
    app.use(views(r('../../../dist')), {
        extension: 'html'
    });
    app.use(async (ctx) => {
        await ctx.render('index');
      })
}