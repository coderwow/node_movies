import mongoose from 'mongoose';
import glob from 'glob';
import {
    resolve
} from 'path';


const db = "mongodb://localhost:27017/douban-test";

mongoose.Promise = global.Promise;

export function initSchemas() {
    glob.sync(resolve(__dirname, './schema', '**/*.js')).forEach(require);
}

export async function initAdmin() {
    const User = mongoose.model('User');
    let user = await User.findOne({
        username: 'kevin'
    })
    if (!user) {
        const user = new User({
            username: 'kevin',
            email: 'kevin@ke.com',
            password: '123456'
        })
        await user.save();
    }
}


export function connect() {
    let maxConnectTimes = 0;
    return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV !== 'production') {
            mongoose.set('debug', true)
        }
        mongoose.connect(db);
        mongoose.connection.on('disconnected', () => {
            maxConnectTimes++;
            if (maxConnectTimes < 5) {
                mongoose.connect(db);
            } else {
                throw new Error('数据库挂了吧  快去修吧少年 ！');
            }
        })

        mongoose.connection.on('error', err => {
            maxConnectTimes++;
            if (maxConnectTimes < 5) {
                mongoose.connect(db);
            } else {
                throw new Error('数据库挂了吧  快去修吧少年 ！');
            }
        })


        mongoose.connection.once('open', () => {
            resolve();
            console.log('数据库连接成功 ！');
        })
    })
}