const Employee = require("../model/employeeSchema");

const getAllEmployees = async (req, res) => {
    try {
        const data = await Employee.find().exec();
        if (data.length == 0)
            throw { statusCode: 204, message: "No employee found." };
        return res.status(200).json({ data: data });
    } catch (error) {
        if (error.statusCode)
            return res.status(error.statusCode).json({ message: error.message.toString() });
        else
            return res.status(500).json({ message: error.toString() });
    }
};

const createNewEmployee = async (req, res) => {
    const { firstname, lastname, email } = req.body;
    if (!firstname || !lastname || !email) {
        throw { statusCode: 403, message: "please provide all filelds { firstname, lastname, email }" };
    }
    try {
        const foundEmployee = await Employee.findOne({ email });

        if (foundEmployee)
            throw { statusCode: 409, message: "Email already exists for another employee" };

        // const newEmployee = new Employee({ firstname, lastname, email });
        // await newEmployee.save();
        const result = await Employee.create({ firstname, lastname, email });
        return res.status(201).send({ msg: `Employee added ${email}`, id: result._id });
    } catch (error) {
        if (error.statusCode)
            return res.status(error.statusCode).json({ message: error.message.toString() });
        else
            return res.status(500).json({ message: error.toString() });
    }
};

const updateEmployee = async (req, res) => {
    try {
        const { id, firstname, lastname, email } = req.body;
        if (!firstname || !lastname || !id) {
            throw { statusCode: 403, message: "please provide this { id, firstname, lastname }" }
        }

        const foundEmployee = await Employee.findOne({ _id: id });

        if (!foundEmployee)
            throw { statusCode: 204, message: `No employee found under this ${email} email` };

        await Employee.findByIdAndUpdate(foundEmployee._id, { firstname, lastname }).exec();
        return res.status(200).json({ msg: `Employee updated ${foundEmployee.firstname} ${foundEmployee.lastname}`, id: foundEmployee._id });
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
            throw { statusCode: 403, message: "Please provide ID to delete" };
        }

        const foundEmployee = await Employee.findByIdAndDelete({ _id: id });
        if (!foundEmployee) {
            throw { statusCode: 403, message: `No employee under this id ${id}` };
        }

        return res.status(200).json({
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

const getEmployeeByID = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id)
            throw { statusCode: 403, message: `Please provide id to delete employee` };
        const employeeObj = await Employee.findOne({ _id: id });
        if (!employeeObj)
            throw { statusCode: 404, message: `No employee found under this ${id}` };

        res.json(employeeObj);
    } catch (err) {
        if (error.statusCode)
            return res.status(error.statusCode).json({ message: error.message.toString() });
        else
            return res.status(500).json({ message: error.toString() });
    }
};

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeByID
};