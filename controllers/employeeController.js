const data = {
    employees: require("../model/data.json"),
    setEmployees: function (data) { this.employees = data },
}

const getAllEmployees = (req, res) => {
    res.json(data.employees);
};

const createNewEmployee = (req, res) => {
    const { firstname, lastname } = req.body;
    if (!firstname || !lastname) {
        throw Error("please provide this { firstname, lastname }");
    }
    const maxID = data.employees.length > 0 ? data.employees.reduce((accumulator, current) => {
        return accumulator.id > current.id ? accumulator : current;
    }).id : 0;
    let newEmployee = { id: maxID + 1, firstname, lastname };
    data.setEmployees([...data.employees, newEmployee]);
    res.send({ msg: "employee added", data });
};

const updateEmployee = (req, res) => {
    const { id, firstname, lastname } = req.body;
    if (!id || !firstname || !lastname) {
        throw Error("please provide this { id, firstname, lastname }");
    }
    const objectIndexToUpdate = data.employees.findIndex((item) => item.id == id);
    data.employees[objectIndexToUpdate] = { id, firstname, lastname };
    res.status(201).json({ msg: "employee updated", data: data.employees });
};

const deleteEmployee = (req, res) => {
    const { id } = req.body;
    if (!id) {
        throw Error("please provide ID to delete");
    }

    let objToDelete = data.employees.find((item) => item.id == id);
    if (!objToDelete) {
        throw Error(`No employee under this id ${id}`);
    }
    data.setEmployees(data.employees.filter((item) => item.id != id));
    res.json({ msg: "employee deleted", data: data.employees });
};

const getEmployeeByID = (req, res) => {
    const { id } = req.params;
    const employeeObj = data.employees.find((item) => item.id == id);
    if (!employeeObj) {
        throw Error(`No employee found under this ${id}`);
    }
    res.json(employeeObj);
};

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeByID
};