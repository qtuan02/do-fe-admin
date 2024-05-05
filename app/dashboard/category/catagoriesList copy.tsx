import { useMemo } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable,
    type MRT_ColumnDef,
} from 'material-react-table';

//example data type
type Category = {
    name: string;
};

//nested data is ok, see accessorKeys in ColumnDef below
const data: Category[] = [
    {
        name: 'dien thoai'
    },
    {
        name: 'may tinh'
    },
];

const Example = () => {
    //should be memoized or stable
    const columns = useMemo<MRT_ColumnDef<Category>[]>(
        () => [
            {
                accessorKey: 'name', //access nested data with dot notation
                header: 'Category Name',
                size: 150,
            },

        ],
        [],
    );

    const table = useMaterialReactTable({
        columns,
        data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    });

    return <MaterialReactTable table={table} />;
};

export default Example;
