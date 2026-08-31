// This file will add both p5 instanced and global intellisence
import module = require('p5');
import * as p5Global from 'p5/global'

export = module;
export as namespace p5;

declare global {
    interface Window {
        p5: typeof module,
    }

    // p5.sound's loadSound is not exposed as a global in @types/p5
    function loadSound(
        path: string | any[],
        successCallback?: (...args: any[]) => any,
        errorCallback?: (...args: any[]) => any,
        whileLoading?: (...args: any[]) => any
    ): any;
}

// p5.Element's .changed() method is missing from @types/p5
declare module 'p5' {
    interface Element {
        changed(fxn: ((...args: any[]) => any) | boolean): Element;
    }
}

