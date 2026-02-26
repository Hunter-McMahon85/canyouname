class GameFunctions {
    //functions to evaluate sparql queiries and see if they match the current selected category
    //all functions in this object should return a boolean value
    constructor() {}

    AllFemales(R: any): boolean {
        const g = R.personSexLabel.value;
        return (g == 'female' || g == 'trans woman');
    }

    AllMales(R: any): boolean {
        const g = R.personSexLabel.value;
        return (g == 'male' || g == 'trans man');
    }
}

export default GameFunctions