import { useUtils } from "../src/use-utils";

const test = (callback) => {
    callback() === true;
};

test(() => {
    useUtils() === 'hello'
})