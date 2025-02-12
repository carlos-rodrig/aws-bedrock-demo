export const handler = async (event, context) => {
    const agent = event.agent;
    const actionGroup = event.actionGroup;
    const func = event.function;
    const parameters = event.parameters || [];

    // Function to get the number of the current hours.
    const get_time = () => {
        return new Date().toISOString().split('T')[1].split('.')[0];
    };

    // Function to add two numbers.
    const add_two_numbers = (number_1, number_2) => {
        return number_1 + number_2;
    };

    // Extracting values from parameters.
    const paramDict = {};
    parameters.forEach(param => {
        if (param.type === 'number') {
            paramDict[param.name.toLowerCase()] = parseInt(param.value, 10);
        }
    });

    let responseBody;

    // Check the function name and execute the corresponding action.
    if (func === "add_two_numbers") {
        const number_1 = paramDict["number_1"];
        const number_2 = paramDict["number_2"];

        if (number_1 !== undefined && number_2 !== undefined) {
            if (!isNaN(number_1) && !isNaN(number_2)) {
                const result = add_two_numbers(number_1, number_2);
                responseBody = { TEXT: { body: `The result of adding ${number_1} and ${number_2} is ${result}` } };
            } else {
                responseBody = { TEXT: { body: "Error: Non-integer parameters." } };
            }
        } else {
            responseBody = { TEXT: { body: "Error: Missing one or more required parameters." } };
        }
    } else if (func === "get_time") {
        const result = get_time();
        responseBody = { TEXT: { body: `The time is ${result}` } };
    } else {
        responseBody = { TEXT: { body: `The function ${func} was called successfully!` } };
    }

    const actionResponse = {
        actionGroup: actionGroup,
        function: func,
        functionResponse: {
            responseBody: responseBody
        }
    };

    const dummyFunctionResponse = { response: actionResponse, messageVersion: event.messageVersion };
    console.log("Response:", JSON.stringify(dummyFunctionResponse, null, 2));

    return dummyFunctionResponse;
};
