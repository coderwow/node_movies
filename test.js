class Boy {
    @run
    speak() {
        console.log('I can say')
    }
}

// 装饰器不能用箭头函数

/* const run = () => {
    console.log(target);
    console.log(key);
    console.log(descripter);
    console.log('I can run');
} */

// console.log(typeof run)

function run(target,key,descripter){
    console.log(target);
    console.log(key);
    console.log(descripter);
    console.log('I can run');
}

const xiaoming = new Boy();
xiaoming.speak();