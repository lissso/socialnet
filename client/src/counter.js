// import { Component } from "react";

// // class NameOfClassComponent extends Component {
// //     constructor() {
// //         super(); // <--- to access our parent's class constructor function
// //         this.state = {}; //<--- to create state for our compionent
// //     }
// //     render() {
// //         return <h1>element created by the class component</h1>;
// //     }
// // }

// class Counter extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             count: 0,
//         };
//         //  we bind the "THIS" from here, and tell our incrementCount
//         // method that its value of "THIS", is the one from up here
//         this.incrementCount = this.incrementCount.bind(this);
//     }
//     componentDidMount() {
//         console.log("counter just mounted");
//     }
//     incrementCount() {
//         console.log("the user wants to increment the count");
//         console.log("this", this);
//         // to interact with state in react we use a special function called
//         // setState
//         this.setState({
//             count: this.state.count + 1,
//         });
//     }
//     render() {
//         console.log("props passed to counter", this.props);
//         return (
//             <div>
//                 <h1>favFood prop val: {this.props.favFood}</h1>
//                 <h1>I am the counter</h1>
//                 <h2>current count is {this.state.count}</h2>
//                 <button onClick={this.incrementCount}>
//                     Click me to count up :)
//                 </button>
//                 <button onClick={() => this.incrementCount()}>
//                     Click me to count up :)
//                 </button>
//             </div>
//         );
//     }
// }

// export default Counter;
