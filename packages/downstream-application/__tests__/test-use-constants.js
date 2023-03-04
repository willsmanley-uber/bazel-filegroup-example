import { useConstants } from "../src/use-constants";

const test = (callback) => {
    callback() === true;
};

test(() => {
    useConstants() === 'asdf'
})