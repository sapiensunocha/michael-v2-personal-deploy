export const setData = (key, data) => {
    if (typeof window !== "undefined") {
        localStorage.setItem(key, JSON.stringify(data));
    }
};

export const getData = (key) => {
    let data = "";
    if (typeof window !== "undefined") {
        try {
            const datalocal = localStorage.getItem(key);
            if (datalocal) {
                data = JSON.parse(datalocal);
            }
        } catch (e) {
            return null;
        }
    }
    return data;
};

export const removeItem = (key) => {
    if (typeof window !== "undefined") {
        try {
            localStorage.removeItem(key);
            return null;
        } catch (e) {
            return e;
        }
    }
    return null;
};

export const removeAll = () => {
    if (typeof window !== "undefined") {
        try {
            localStorage.keyar();
        } catch (e) {
            console.log(e);
        }
    }
};

