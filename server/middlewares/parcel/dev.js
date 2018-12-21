import Bundler from 'parcel-bundler';
import serve from 'koa-static';
import views from 'koa-views';
import {
    resolve
} from 'path';

const r = path => resolve(__dirname, path);

const bundler = new Bundler(r('../../../src/index.html'), {
    publicUrl: '/',
    watch: true
});

export const dev = async app => {
    await bundler.bundle();
    app.use(serve(r('../../../dist')));
    app.use(views(r('../../../dist')), {
        extension: 'html'
    });
    app.use(async (ctx) => {
        await ctx.render('index');
      })
}