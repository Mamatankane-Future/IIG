class OwnMap{
    constructor(){
        this.map = new Map();
    }

    get(key){
        return this.map.get(key);
    }

    set(key, value){
        this.map.set(key, value);
    }

    delete(key){
        this.map.delete(key);
    }

    values(){
        return [...this.map];
    }


}

export default OwnMap;