//React.render(
//    <h1>Hello, world!</h1>,
//    document.getElementById('example')
//);

var IntlMixin         = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;
var FormattedNumber = ReactIntl.FormattedNumber;

var FoodRow = React.createClass({
    mixins: [IntlMixin],
    render: function() {
        var affinityNeeded = this.props.dino.affinityBase + this.props.dino.affinityPerLevel * this.props.dinoLevel;
        var foodNeeded = Math.ceil(affinityNeeded / this.props.food.affinity);
        var timeNeeded = foodNeeded * this.props.food.hunger / this.props.dino.hungerDrainRate;
        var timeNeededMinutes = timeNeeded / 60;

        var toporDrainRate = this.props.dino.toporDrainBase + this.props.dino.toporDrainPerLevel * this.props.dinoLevel;
        var toporTotal = this.props.dino.toporBase + this.props.dino.toporPerLevel * this.props.dinoLevel;

        var toporNeeded = timeNeeded * toporDrainRate - toporTotal;
        var narcoticsNeeded = Math.max(Math.ceil(toporNeeded / 40), 0);

        return(
            <tr className="FoodRow">
                <td>{this.props.food.name}</td>
                <td>{foodNeeded}</td>
                <td>
                    <FormattedMessage
                        message={"{time, plural,\n  =0 {# minutes}\n  =1 {1 minute}\n  other {{timeFormatted} minutes}\n}\n"}
                        time={timeNeededMinutes}
                        timeFormatted={
                            <FormattedNumber
                                value={timeNeededMinutes}
                                maximumFractionDigits={1}
                            />}
                    />
                </td>
                <td>
                    <FormattedMessage
                        message={"{narcotics, plural,\n  =0 {none}\n  =1 {# narcotic}\n  other {# narcotics}\n}\n"}
                        narcotics={narcoticsNeeded}
                    />
                </td>
            </tr>
        );
    }
});

var FoodTable = React.createClass({
    render: function() {
        var rows = [];
        var self = this;
        this.props.foodOptions.forEach(function(food, key) {
            food.diets.forEach(function(diet) {
                if(diet == self.props.dino.diet) {
                    rows.push(<FoodRow food={food} dino={self.props.dino} dinoLevel={self.props.dinoLevel} key={key} {...intlData} />);
                }
            });
        });
        return(
            <table id="FoodTable" className="u-full-width">
                <thead><tr><th>Food Type</th><th>Food needed</th><th>Time required</th><th>Drugs needed</th></tr></thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        );
    }
});

var DrugInfo = React.createClass({
    mixins: [IntlMixin],
    render: function() {
        var toporDrainRate = this.props.dino.toporDrainBase + this.props.dino.toporDrainPerLevel * this.props.dinoLevel;
        var toporDrainRatePerMinute = toporDrainRate * 60;
        var toporTotal = this.props.dino.toporBase + this.props.dino.toporPerLevel * this.props.dinoLevel;
        var minutesToWakeUp = toporTotal / toporDrainRate / 60;

        var narcoticsRate = Math.floor(40 / toporDrainRate);
        var narcoberriesRate = Math.floor(7.5 / toporDrainRate);

        return(
            <div id="DrugInfo">
                <div>Topor Drain Rate:
                    <span><FormattedNumber
                        value={toporDrainRatePerMinute}
                        maximumFractionDigits={1}
                        /> / min</span>
                </div>
                <div>Time to Wake Up:
                    <span><FormattedNumber
                        value={minutesToWakeUp}
                        maximumFractionDigits={1}
                        /> minutes</span>
                </div>
                <div>Drugs needed: <span>1 Narcotic / {narcoticsRate} seconds</span>, <span>1 Narcoberry / {narcoberriesRate} seconds</span></div>
            </div>
        );
    }
});

var TamingGraph = React.createClass({
    render: function() {
        return(
            <div><canvas id="myChart" width="400" height="400"></canvas></div>
        );
    },
    componentDidMount: function() {
        var config = {
            data: {
                labels: ["January", "February", "March", "April", "May", "June", "July"], datasets: [{
                    label               : "My First dataset",
                    fillColor           : "rgba(220,220,220,0.2)",
                    strokeColor         : "rgba(220,220,220,1)",
                    pointColor          : "rgba(220,220,220,1)",
                    pointStrokeColor    : "#fff",
                    pointHighlightFill  : "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data                : [65, 59, 80, 81, 56, 55, 40]
                }, {
                    label               : "My Second dataset",
                    fillColor           : "rgba(151,187,205,0.2)",
                    strokeColor         : "rgba(151,187,205,1)",
                    pointColor          : "rgba(151,187,205,1)",
                    pointStrokeColor    : "#fff",
                    pointHighlightFill  : "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data                : [28, 48, 40, 19, 86, 27, 90]
                }]
            },
            options: {}
        };

        var ctx = $("#myChart").get(0).getContext("2d");
        var myNewChart = new Chart(ctx).Line(config);
        console.log(myNewChart);
    }
});

var TamingCalculations = React.createClass({
    render: function() {
        return(
            <div id="TamingCalculations">
                <DrugInfo dino={this.props.dino} dinoLevel={this.props.dinoLevel} {...intlData} />
                <FoodTable foodOptions={this.props.foodOptions} dino={this.props.dino} dinoLevel={this.props.dinoLevel} {...intlData} />
            </div>
        );
    }
});

//var DinoOption = React.createClass({
//    render: function() {
//        return(
//            <option value="this.props.dino.name">{this.props.dino.fullName}</option>
//        );
//    }
//});

var DinoSelector = React.createClass({
    handleChange: function() {
        this.props.onUserInput(
            this.refs.dinoSelect.getDOMNode().value,
            this.refs.dinoLevelInput.getDOMNode().value
        );
    },
    render: function() {
        var rows = [];

        this.props.dinos.forEach(function(dino, key) {
            rows.push(<option value={dino.name} key={key}>{dino.fullName}</option>)
        });

        return(
            <form id="DinoSelector">
                <div className="row">
                    <label className="six columns">
                        Dino
                        <select
                            id="DinoOptions"
                            className="u-full-width"
                            value={this.props.dinoSelected}
                            ref="dinoSelect"
                            onChange={this.handleChange}
                        >
                            {rows}
                        </select>
                    </label>
                    <label className="six columns">
                        Level
                        <input
                            id="DinoLevel"
                            className="u-full-width"
                            type="number"
                            value={this.props.dinoLevel}
                            ref="dinoLevelInput"
                            onChange={this.handleChange}
                        />
                    </label>
                </div>
            </form>
        );
    }
});

var ArkTamingCalculator = React.createClass({
    getInitialState: function() {
        return {
            dinoSelected: 'Dilo',
            dinoLevel: 1
        };
    },
    handleUserInput: function(dinoSelected, dinoLevel) {
        this.setState({
            dinoSelected: dinoSelected,
            dinoLevel: dinoLevel
        });
    },
    render: function() {
        var self = this;
        var dino = this.props.dinos.filter(function(dino) {
            return dino.name == self.state.dinoSelected;
        })[0];

        return(
            <div id="ArkTamingCalculator" className="container">
                <DinoSelector
                    dinos={this.props.dinos}
                    dinoSelected={this.state.dinoSelected}
                    dinoLevel={this.state.dinoLevel}
                    onUserInput={this.handleUserInput}
                />
                <TamingCalculations
                    foodOptions={this.props.foodOptions}
                    dino={dino}
                    dinoLevel={this.state.dinoLevel}
                    {...intlData}
                />
                <TamingGraph
                    foodOptions={this.props.foodOptions}
                    dino={dino}
                    dinoLevel={this.state.dinoLevel}
                    {...intlData}
                />
            </div>
        );
    }
});

var DINOS = [
    {
        name: 'Ptera',
        fullName: 'Pteranodon',
        affinityBase: 1200,
        affinityPerLevel: 60,
        hungerDrainRate: 20/60,
        toporBase: 112.8,
        toporPerLevel: 7.2,
        toporDrainBase: 0.3,
        toporDrainPerLevel: 0.006,
        diet: 'carnivore'
    },
    {
        name: 'Dilo',
        fullName: 'Dilo',
        affinityBase: 450,
        affinityPerLevel: 22.5,
        hungerDrainRate: 90/60,
        toporBase: 70.5,
        toporPerLevel: 4.5,
        toporDrainBase: 0.3,
        toporDrainPerLevel: 0.006,
        diet: 'carnivore'
    },
    {
        name: 'Trike',
        fullName: 'Triceratops',
        affinityBase: 3000,
        affinityPerLevel: 150,
        hungerDrainRate: 66.67/60,
        toporBase: 235,
        toporPerLevel: 15,
        toporDrainBase: 0.3,
        toporDrainPerLevel: 0.006,
        diet: 'herbivore'
    }
];

var FOOD = [
    {name: 'Crop', affinity: 40, hunger: 40, diets: ['herbivore']},
    {name: 'Mejoberry', affinity: 30, hunger: 30, diets: ['herbivore']},
    {name: 'Raw Meat', affinity: 50, hunger: 50, diets: ['carnivore']},
    {name: 'Cooked Meat', affinity: 25, hunger: 25, diets: ['carnivore']},
    {name: 'Jerky', affinity: 25, hunger: 25, diets: ['carnivore']},
    {name: 'Cooked Prime Meat', affinity: 75, hunger: 50, diets: ['carnivore']},
    {name: 'Prime Jerky', affinity: 75, hunger: 50, diets: ['carnivore']},
    {name: 'Spoiled Meat', affinity: 100, hunger: 50, diets: ['scavenger']},
    {name: 'Raw Prime Meat', affinity: 150, hunger: 50, diets: ['carnivore']},
    {name: 'Kibble', affinity: 400, hunger: 80, diets: ['herbivore', 'carnivore']}
];

var intlData = {
    "locales": "en-US",
    "messages": {
        "timeRequired": "{time, plural,\n  =0 {minutes}\n  =1 {minute}\n  other {# minutes}\n}\n"
    }
};

React.render(<ArkTamingCalculator dinos={DINOS} foodOptions={FOOD} {...intlData} />, document.body);
