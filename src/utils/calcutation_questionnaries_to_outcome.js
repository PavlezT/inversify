function round(value) {
    return Number(Math.round(value+'e'+2)+'e-'+2);
}

exports.calcWOMAC = function (results) {
    return {
        params: ['Total', 'Pain', 'Stiffness', 'Function'],
        points: [
            {
                param: 'Total',
                value: round(results.reduce((ak, ans) => ak += parseInt(ans.value), 0) / 24)
            },
            {
                param: 'Pain',
                value: round(results.filter(ans => ans.id <= 5).reduce((ak, ans) => ak += parseInt(ans.value), 0) / 5)
            },
            {
                param: 'Stiffness',
                value: round(results.filter(ans => ans.id > 5 && ans.id <= 7).reduce((ak, ans) => ak += parseInt(ans.value), 0) / 2)
            },
            {
                param: 'Function',
                value: round(results.filter(ans => ans.id > 7).reduce((ak, ans) => ak += parseInt(ans.value), 0) / 17)
            }
        ]
    };
}

exports.calcFAOS = function (results) {
    return {
        params: ['Pain', 'Symptoms', 'ADL', 'Sport', 'QoL', 'Total'],
        points: [
            {
                param: 'Pain', //ak+=(ans.value-1) - because values should be from 0 -4, but really get 1- 5
                value: round(100 - ((results.filter(ans => ans.id >= 8 && ans.id <= 16).reduce((ak, ans)=> ak+=(ans.value-1) , 0) ) * 100) / 36)
            },
            {
                param: 'Symptoms',
                value: round(100 - ((results.filter(ans => ans.id >= 1 && ans.id <= 5).reduce((ak, ans)=> ak+=(ans.value-1) , 0) ) * 100) / 28)
            },
            {
                param: 'ADL',
                value: round(100 - ((results.filter(ans => ans.id >= 14 && ans.id <= 33).reduce((ak, ans)=> ak+=(ans.value-1) , 0) ) * 100) / 68)
            },
            {
                param: 'Sport',
                value: round(100 - ((results.filter(ans => ans.id >= 34 && ans.id <= 38).reduce((ak, ans)=> ak+=(ans.value-1) , 0) ) * 100) / 20)
            },
            {
                param: 'QoL',
                value: round(100 - ((results.filter(ans => ans.id >= 39 && ans.id <= 42).reduce((ak, ans)=> ak+=(ans.value-1) , 0) ) * 100) / 16)
            },
            {
                param: 'Total',
                value: round(100 - ((results.reduce((ak, ans)=> ak+=(ans.value-1) , 0) ) * 100) / 168)
            }
        ]
    };
}

exports.calcOXFORD_HIP = function (results) {
    return {
        params: ['Score'],
        points: [
            {
                param: 'Score',
                value: results.reduce((ak, ans)=> ak+=(ans.value-1) , 0)
            }
        ]
    };
}

exports.calcOXFORD_KNEE = function (results) {
    return {
        params: ['Score'],
        points: [
            {
                param: 'Score',
                value:  results.reduce((ak, ans)=> ak+=(ans.value-1) , 0)
            }
        ]
    };
}

exports.calcKOOS = function (results) {
    return {
        params: ['Pain', 'Symptoms', 'ADL', 'Sport', 'QoL', 'Total'],
        points: [
            {
                param: 'Pain', //ak+=(ans.value-1) - because values should be from 0 -4, but really get 1- 5
                value: round(100 - ((results.filter(ans => ans.id >= 8 && ans.id <= 16).reduce((ak, ans)=> ak+=(ans.value-1) , 0) )/9 * 100) / 4)
            },
            {
                param: 'Symptoms',
                value: round(100 - ((results.filter(ans => ans.id >= 1 && ans.id <= 7).reduce((ak, ans)=> ak+=(ans.value-1) , 0) )/7 * 100) / 4)
            },
            {
                param: 'ADL',
                value: round(100 - ((results.filter(ans => ans.id >= 17 && ans.id <= 33).reduce((ak, ans)=> ak+=(ans.value-1) , 0))/17 * 100) / 4)
            },
            {
                param: 'Sport',
                value: round(100 - ((results.filter(ans => ans.id >= 34 && ans.id <= 38).reduce((ak, ans)=> ak+=(ans.value-1) , 0) )/5 * 100) / 4)
            },
            {
                param: 'QoL',
                value: round(100 - ((results.filter(ans => ans.id >= 39 && ans.id <= 42).reduce((ak, ans)=> ak+=(ans.value-1) , 0) )/4 * 100) / 4)
            },
            {
                param: 'Total',
                value: round(100 - ((results.reduce((ak, ans)=> ak+=(ans.value-1) , 0) )/42 * 100) / 4)
            }
        ]
    };
}

exports.calcED_5D = function (results) {
    return {
        params: ['Pain', 'Self-care', 'Mobility', 'Usual activity', 'Anxiety', 'EQ VAS'],
        points: [
            {
                param: 'Pain',
                value: results.filter(ans => ans.id == 4).reduce((ak, ans) => ak+=ans.value, 0)
            },
            {
                param: 'Self-care',
                value: results.filter(ans => ans.id == 2).reduce((ak, ans) => ak+=ans.value, 0)
            },
            {
                param: 'Mobility',
                value: results.filter(ans => ans.id == 1).reduce((ak, ans) => ak+=ans.value, 0)
            },
            {
                param: 'Usual activity',
                value: results.filter(ans => ans.id == 3).reduce((ak, ans) => ak+=ans.value, 0)
            },
            {
                param: 'Anxiety',
                value: results.filter(ans => ans.id == 5).reduce((ak, ans) => ak+=ans.value, 0)
            },
            {
                param: 'EQ VAS',
                value: results.filter(ans => ans.id == 6).reduce((ak, ans) => ak+=ans.value, 0)
            }
        ]
    };
}

exports.calcSF_36 = function (results) {
    const group1 = [1,2,20,22,34,36];
    const group2 = [3,4,5,6,7,8,9,10,11,12];
    const group3 = [13,14,15,16,17,18,19];
    const group4 = [21,23,26,27,30];
    const group5 = [24,25,28,29,31];
    const group6 = [32,33,35];

    const score1 = [3,4,5,6,7,8,9,10,11,12];
    const score2 = [13,14,15,16];
    const score3 = [17,18,19];
    const score4 = [23,27,29,31];
    const score5 = [24,25,26,28,30];
    const score6 = [20,32];
    const score7 = [21,22];
    const score8 = [1,33,34,35,36];
    const score9 = [1,2,3,8];
    const score10 = [4,5,6,7];
    const score11 = [5,6,7];

    results = results.map(answer => {
        answer.score = 0;

        if ( group1.includes(answer.id) ){
            switch(answer.value) {
                case 1:
                    answer.score = 100;
                    break;
                case 2:
                    answer.score = 75;
                    break;
                case 3:
                    answer.score = 50;
                    break;
                case 4:
                    answer.score = 25;
                    break;
                case 5:
                    answer.score = 0;
                    break;
                default:
                    answer.score = 0;
            }
        } else if ( group2.includes(answer.id)) {
            switch(answer.value) {
                case 1:
                    answer.score = 0;
                    break;
                case 2:
                    answer.score = 50;
                    break;
                case 3:
                    answer.score = 100;
                    break;
                default:
                    answer.score = 0;
            }
        } else if ( group3.includes(answer.id)) {
            switch(answer.value) {
                case false:
                    answer.score = 100;
                    break;
                case true:
                    answer.score = 0;
                    break;
                default:
                    answer.score = 50;
            }
        } else if ( group4.includes(answer.id)) {
            switch(answer.value) {
                case 1:
                    answer.score = 100;
                    break;
                case 2:
                    answer.score = 80;
                    break;
                case 3:
                    answer.score = 60;
                    break;
                case 4:
                    answer.score = 40;
                    break;
                case 5:
                    answer.score = 20;
                    break;
                case 6:
                    answer.score = 0;
                    break;
                default:
                    answer.score = 0;
            }
        } else if ( group5.includes(answer.id)) {
            switch(answer.value) {
                case 1:
                    answer.score = 0;
                    break;
                case 2:
                    answer.score = 20;
                    break;
                case 3:
                    answer.score = 40;
                    break;
                case 4:
                    answer.score = 60;
                    break;
                case 5:
                    answer.score = 80;
                    break;
                case 6:
                    answer.score = 100;
                    break;
                default:
                    answer.score = 0;
            }
        } else if ( group6.includes(answer.id)) {
            switch(answer.value) {
                case 1:
                    answer.score = 0;
                    break;
                case 2:
                    answer.score = 25;
                    break;
                case 3:
                    answer.score = 50;
                    break;
                case 4:
                    answer.score = 75;
                    break;
                case 5:
                    answer.score = 100;
                    break;
                default:
                    answer.score = 0;
            }
        }

        return answer;
    });

    return {
        params: [
            'Phys. function',
            'Pain', 
            'Phys. limit', 
            'Emotion. limit', 
            'Social function', 
            'Emotion well-being', 
            'Energy/Fatigue', 
            'General health', 
            'Physical score', 
            'Mental score', 
            'Irritability score', 
            'Total'
        ],
        points: [
            {
                param: 'Phys. function',
                value: round(results.filter(ans => score1.includes(ans.id)).reduce((ak, ans)=> ak+=ans.score , 0) / 10)
            },
            {
                param: 'Pain',
                value: round(results.filter(ans => score7.includes(ans.id)).reduce((ak, ans)=> ak+=ans.score , 0) / 2)
            },
            {
                param: 'Phys. limit',
                value: round(results.filter(ans => score2.includes(ans.id)).reduce((ak, ans)=> ak+=ans.score , 0) / 4)
            },
            {
                param: 'Emotion. limit',
                value: round(results.filter(ans => score3.includes(ans.id)).reduce((ak, ans)=> ak+=ans.score , 0) / 3)
            },
            {
                param: 'Social function',
                value: round(results.filter(ans => score6.includes(ans.id)).reduce((ak, ans)=> ak+=ans.score , 0) / 2)
            },
            {
                param: 'Emotion well-being',
                value: round(results.filter(ans => score5.includes(ans.id)).reduce((ak, ans)=> ak+=ans.score , 0) / 5)
            },
            {
                param: 'Energy/Fatigue',
                value: round(results.filter(ans => score4.includes(ans.id)).reduce((ak, ans)=> ak+=ans.score , 0) / 4)
            },
            {
                param: 'General health',
                value: round(results.filter(ans => score8.includes(ans.id)).reduce((ak, ans)=> ak+=ans.score , 0) / 5)
            },
            {
                param: 'Physical score',
                value: round(results.filter(ans => score9.includes(ans.id)).reduce((ak, ans)=> ak+=ans.score , 0) / 4)
            },
            {
                param: 'Mental score',
                value: round(results.filter(ans => score10.includes(ans.id)).reduce((ak, ans)=> ak+=ans.score , 0) / 4)
            },
            {
                param: 'Irritability score',
                value: round(results.filter(ans => score11.includes(ans.id)).reduce((ak, ans)=> ak+=ans.score , 0) / 3)
            },
            {
                param: 'Total',
                value: round(results.reduce((ak, ans)=> ak+=(ans.score || 0), 0) / 36)
            }
        ]
    };
}

exports.calcOswestry = function (results) {
    const vas = results.filter(ans => ans.id == 11);
    const answersCount = results.filter(ans => ans.id != 11 && ans.value != null).length;

    return {
        params: ['VAS', 'Score'],
        points: [
            {
                param: 'VAS',
                value: vas && vas[0] ? vas.value : 0
            },
            {
                param: 'Score',
                value: round(results.filter(ans => ans.id != 11 && ans.value != null).reduce((ak, ans)=> ak+=(ans.value-1) , 0) * 100 / (answersCount* 5) ) // 50 is results.length (10 answers) * maxValue (5)
            }
        ]
    };
}

exports.calcSTEADI = function (results) {
    return {
        params: ['Total'],
        points: [
            {
                param: 'Total',
                value: results.reduce((ak, ans, index) => ak + (ans.value ? (index < 2 ? 2 : 1) : 0), 0)
            }
        ]
    };
}

exports.calcAposShortForm = function (results) {
    results.map(answer => {        
        if ( answer.id === 1 || answer.id === 2) {
            answer.score = answer.value * 10;
        }
        else if( answer.id === 3) {
            switch(answer.value) {
                case 1:
                    answer.score = 100;
                case 2:
                    answer.score = 75;
                case 3:
                    answer.score = 50;
                case 4:
                    answer.score = 25;
                case 5:
                    answer.score = 0;
                default:
                    answer.score = 0;
            }
        }
        else if ( answer.id === 4) {
            switch(answer.value) {
                case 1:
                    answer.score = 0;
                case 2:
                    answer.score = 25;
                case 3:
                    answer.score = 50;
                case 4:
                    answer.score = 75;
                case 5:
                    answer.score = 100;
                default:
                    answer.score = 0;
            }
        }
        else if (answer.id === 5 ) {
            switch(answer.value) {
                case 1:
                    answer.score = 0;
                case 2:
                    answer.score = 50;
                case 3:
                    answer.score = 100;
                default:
                    answer.score = 0;
            }
        }
        else if (answer.id === 6) {
            switch(answer.value) {
                case 1:
                    answer.score = 0;
                case 2:
                    answer.score = 20;
                case 3:
                    answer.score = 40;
                case 4:
                    answer.score = 60;
                case 5:
                    answer.score = 80;
                case 6:
                    answer.score = 100;
                default:
                    answer.score = 0;
            }
        }
    })

    return {

        params: ['Function', 'Pain', 'Social activity', 'Emotional wellbeing', 'Patient satisfaction', 'NPS'],
        points: [
            {
                param: 'Function',
                value: round(results.filter(ans => [1,2,5].includes(ans.id)).reduce((akk, val) => akk += val, 0) / 3)
            },
            {
                param: 'Pain',
                value: (results.find(ans => ans.id === 3) || {}).score
            },
            {
                param: 'Social activity',
                value: (results.find(ans => ans.id === 4) || {}).score
            },
            {
                param: 'Emotional wellbeing',
                value: (results.find(ans => ans.id === 6) || {}).score
            },
            {
                param: 'Patient satisfaction',
                value: (results.find(ans => ans.id === 7) || {}).value
            },
            {
                param: 'NPS',
                value: (results.find(ans => ans.id === 8) || {}).value
            }

        ]
    }
}

// no calculation algorithm provided
exports.calcFamily_friends = function (results) {
    return {
        params: ['Score'],
        points: [
            {
                param: 'Score',
                value: 50.5
            }
        ]
    };
}
// even unknown list of params

exports.calcSatisfaction_FU = function (results) {
    return {
        params: ['VAS', 'Score'],
        points: [
            {
                param: 'VAS',
                value: 50.5
            },
            {
                param: 'Score',
                value: 50.5
            }
        ]
    };
}

exports.calcSatisfaction_IC = function (results) {
    return {
        params: ['VAS', 'Score'],
        points: [
            {
                param: 'VAS',
                value: 50.5
            },
            {
                param: 'Score',
                value: 50.5
            }
        ]
    };
}

exports.calcSatisfaction_NHS = function (results) {
    return {
        params: ['VAS', 'Score'],
        points: [
            {
                param: 'VAS',
                value: 50.5
            },
            {
                param: 'Score',
                value: 50.5
            }
        ]
    };
}