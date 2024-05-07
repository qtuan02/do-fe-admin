import Table from 'react-bootstrap/Table';
import Category from '../page';
import { Button } from 'react-bootstrap';
import { useState } from 'react';
import CreateModal from './create.modal';

interface IProps {
    categories: ICategory[]
}
const CatagoriesList = (props: IProps) => {
    const { categories } = props
    const [showModalCreate, setShowModalCreate] = useState<boolean>(false);

    return (
        <>
            <div className="mb-3 d-flex justify-between ">
                <h3>Categories</h3>
                <Button variant='primary' onClick={() => setShowModalCreate(true)}>Add new</Button>
            </div>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Name</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map(category => {
                        return (
                            <tr key={category.category_id}>
                                <td>{category.category_id}</td>
                                <td>{category.category_name}</td>
                                <td>
                                    <Button variant='warning' className='mr-3'>Edit</Button>
                                    <Button variant='danger'>Delete</Button>
                                </td>
                            </tr>
                        )
                    })}

                </tbody>
            </Table>
            <CreateModal
                showModalCreate={showModalCreate}
                setShowModalCreate={setShowModalCreate}
            />
        </>
    )
}
export default CatagoriesList
