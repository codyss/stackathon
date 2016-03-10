var Leaderboard = React.createClass({
  getInitialState() {
    return {data: [], totalWeekCommits: "", totalWeekPulls: ""}
  },
  componentWillMount() {
    this.firebaseRef = new Firebase("https://kimonocrawlsapi123.firebaseio.com/kimono/api/9echjkze/latest/results/collection1");
    this.firebaseRef.on("value", (dataSnapshot) => {
      var data = [];
      data.push(dataSnapshot.val())
      this.setState({
        data: data[0]
      })
      this.getWeekStats();
    }.bind(this));
  },
  getWeekStats() {
    var newData = this.state.data.slice()
    console.log(newData)
    var totalWeekCommits = 0;
    var totalWeekPulls = 0;
    newData.forEach(student => {
      if(student.lastWeekCommits) totalWeekCommits += parseInt(student.lastWeekCommits);
      if(student.lastWeekPulls) totalWeekPulls += parseInt(student.lastWeekPulls)
    })
    console.log(totalWeekCommits, totalWeekPulls)
    this.setState({totalWeekCommits: totalWeekCommits, totalWeekPulls: totalWeekPulls})
  },
  componentWillUnmount() {
    this.firebaseRef.off();
  },
  render() {
    return (
      <div>
        <h2> 1601 Contributed <bold>{this.state.totalWeekCommits}</bold> Commits and <bold>{this.state.totalWeekPulls}</bold> Pull Requests Over the Last Week</h2>
        <Graph  data={this.state.data} />
      </div>
    )
  }
})


var Graph = React.createClass({
  getInitialState() {
    return {data: ""}
  },
  componentWillReceiveProps() {
    console.log('component will receive props called')
    // this.setState({data: this.props.data})
    this.organizeData()
    this.createChart()
  },
  componentWillUpdate() {
    console.log('componentWillUpdate called')
    // this.organizeData();
    // this.createChart();
  },
  organizeData() {
    if (this.props.data) {
      var dataCopy = this.props.data
      dataCopy.sort((a,b) => {
        return parseInt(a['Contributions'].slice(0,3).trim()) - parseInt(b['Contributions'].slice(0,3).trim())
      })
      dataCopy.reverse()
        this.setState({data: dataCopy})
    }
  },
  createChart() {
    if (this.props.data) {
      var chart = {};
      chart.x = this.props.data.map(student => {
        if (student.fullName) return student.fullName
        else return student.gitName
      })
      chart.y = this.props.data.map(student => student['Contributions'].slice(0,3))
      var layout = {
        title: '1601 Commits'
      }
      Plotly.newPlot('myChart', [chart], layout);
    }
  },
  render() {
    return (
      <div>    
        <div id="myChart"></div>
      </div>
    )
  }
})


ReactDOM.render(
  <Leaderboard />,
  document.getElementById('app')
  )