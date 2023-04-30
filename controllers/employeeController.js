const Employee = require("../model/employeeSchema");

const getAllEmployees = async (req, res) => {
    try {
        const data = await Employee.find().exec();
        return res.status(200).json({ data: data });
    } catch (error) {
        console.error(error);
        res.status(500).send(error.toString());
    }
};

const createNewEmployee = async (req, res) => {
    const { firstname, lastname, email } = req.body;
    if (!firstname || !lastname || !email) {
        return res.status(403).json({ message: "please provide all filelds { firstname, lastname, email }" });
    }
    try {
        const foundEmployee = await Employee.findOne({ email });

        if (foundEmployee)
            throw { statusCode: 409, message: "Email already exists for another employee" };

        const newEmployee = new Employee({ firstname, lastname, email });
        await newEmployee.save();
        return res.send({ msg: `Employee added ${email}`, id: newEmployee._id });
    } catch (error) {
        if (error.statusCode)
            return res.status(error.statusCode).json({ message: error.message.toString() });
        else
            return res.status(500).json({ message: error.toString() });
    }
};

const updateEmployee = async (req, res) => {
    try {
        const { firstname, lastname, email } = req.body;
        if (!firstname || !lastname || !email) {
            throw { statusCode: 403, message: "please provide this { firstname, lastname, email }" }
        }

        const foundEmployee = await Employee.findOne({ email });

        if (!foundEmployee)
            throw { statusCode: 403, message: `No employee found under this ${email} email` };

        await Employee.findByIdAndUpdate(foundEmployee._id, { firstname, lastname }).exec();
        return res.status(201).json({ msg: `Employee updated ${email}`, id: foundEmployee._id });
    } catch (error) {
        if (error.statusCode)
            return res.status(error.statusCode).json({ message: error.message.toString() });
        else
            return res.status(500).json({ message: error.toString() });
    }
};

const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            throw { statusCode: 403, message: "please provide ID to delete" };
        }

        const foundEmployee = await Employee.findByIdAndDelete({ _id: id });
        if (!foundEmployee) {
            throw { statusCode: 403, message: `No employee under this id ${id}` };
        }

        return res.json({
            msg: "Employee deleted",
            Employee: { id: foundEmployee._id, email: foundEmployee.email }
        });
    } catch (error) {
        if (error.statusCode)
            return res.status(error.statusCode).json({ message: error.message.toString() });
        else
            return res.status(500).json({ message: error.toString() });
    }
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