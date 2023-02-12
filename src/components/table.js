import React, { useState } from "react";


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
                <Table data={employees} functions={this.props.functions}/>
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
        return (<div className="mr-20 ml-20 mt-10 mb-10 p-2 border-b-2">
            <input type="text" className="form-control mb-2" placeholder="Search Items..." onChange={(e) => this.props.update(e)} />
        </div>)
    }
}

// Simple TableRow component for showing a <tr>
class TableRow extends React.Component {
    showBtnTest = {
        text: '👀',
    };
    constructor(props) {
        super(props);
        this.state = {isShowBtnToggleOn: true, isEditBtnToggleOn: true};

        // This binding is necessary to make `this` work in the callback
        this.handleShowBtnHover = this.handleShowBtnHover.bind(this);
        this.handleEditBtnHover = this.handleEditBtnHover.bind(this);
    }
    handleShowBtnHover() {
        this.setState(prevState => ({
            isShowBtnToggleOn: !prevState.isShowBtnToggleOn
        }));
    }
    handleEditBtnHover() {
        this.setState(prevState => ({
            isEditBtnToggleOn: !prevState.isEditBtnToggleOn
        }));
    }

    render() {
        return (
            <tr className="trr">
                <td><p className="mx-4">{this.props.libelle}</p></td>
                <td>{this.props.username}</td>
                <td>{this.props.password}</td>
                <td><button className="btn-icon" onClick={()=> this.props.show(this.props.id)} onMouseEnter={this.handleShowBtnHover} onMouseLeave={this.handleShowBtnHover}>{this.state.isShowBtnToggleOn ? '👀' : 'See' }</button></td>
                <td><button className="btn-icon" onClick={()=> this.props.edit(this.props.id)} onMouseEnter={this.handleEditBtnHover} onMouseLeave={this.handleEditBtnHover}>{this.state.isEditBtnToggleOn ? '✏️' : 'Edit' }</button></td>
            </tr>)
    }
};

class Table extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let functions = this.props.functions;
        return (
            <div className="flex items-center justify-center h-auto">
                <table className="table">
                    <tbody>
                        <tr>
                            <th></th>
                        </tr>
                        {this.props.data.map(function (d, i) {
                            return <TableRow key={d.id}
                                id={d.id}
                                libelle={d.libelle}

                                delete={functions[0]}
                                edit={functions[1]}
                                show={functions[2]}
                            />
                        })}
                    </tbody>
                </table>
            </div>
        )
    }

}
export default SearchApp;
