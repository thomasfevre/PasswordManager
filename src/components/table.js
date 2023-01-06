import React from "react";



// Create a SearchApp Component
class SearchApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search: ''
        };
    }
    handleChange(event) {
        // Get event value
        let searchValue = event.target.value;

        // Set the state to trigger a re-rendering
        this.setState({ search: searchValue });
    }
    render() {
        // Filter the table data
        let employees = this.props.data,
            searchString = this.state.search.trim().toLowerCase();

        if (searchString.length > 0) {
            // We are searching. Filter the results.
            employees = employees.filter((e) => e.libelle.toLowerCase().match(searchString));
        }
        // Set the `update` property of the `UserInput` element
        return (
            <div>
                <UserInput update={(e) => this.handleChange(e)} />
                <Table data={employees} />
            </div>
        )
    }
}

// UserInput component
class UserInput extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (<div>
            <input className="form-control mb-2" placeholder="Search Items..." onChange={(e) => this.props.update(e)} />
        </div>)
    }
}

// Simple TableRow component for showing a <tr>
class TableRow extends React.Component {
    render() {
        return (
            <tr>
                <td>{this.props.libelle}</td>
                <td>{this.props.username}</td>
                <td>{this.props.password}</td>
                <button
                  className="delete-button"
                  onClick={() => deleteItem(this.id)}
                >
                  ❌
                </button>
            </tr>)
    }
};

class Table extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'auto',}}>
                <table className="table">
                    <tbody>
                        <tr>
                            <th>libelle</th>
                            <th>username</th>
                            <th>password</th>
                        </tr>
                        {this.props.data.map(function (d, i) {
                            return <TableRow key={'person-' + i}
                                libelle={d.libelle}
                                username={d.username}
                                password={d.password}
                            />
                        })}
                    </tbody>
                </table>
            </div>
        )
    }

}
export default SearchApp;
