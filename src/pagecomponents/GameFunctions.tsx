const GameFunctions = {
    //functions to evaluate sparql queiries and see if they match the current selected category
    //all functions in this object should return a boolean value
    Women: (R: any): boolean => {
        const g = R.personSexLabel.value;
        return (g == 'female' || g == 'trans woman');
    },

    Men: (R: any): boolean => {
        const g = R.personSexLabel.value;
        return (g == 'male' || g == 'trans man');
    },

    People: (R: any): boolean => {
        // this one is filtered by the query itself; this is a formality to maintain modular structure
        return R != null;
    }
}

export default GameFunctions