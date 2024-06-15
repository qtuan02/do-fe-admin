import React from 'react';
import { Pagination } from 'react-bootstrap';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    handlePageChange: (pageNumber: number) => void;
}

export default function PaginationComponent(props: PaginationProps) {
    const { currentPage, totalPages, handlePageChange } = props;

    const renderPaginationItems = () => {
        const pageItems = [];
        const pageRange = 2;
        const ellipsis = <Pagination.Ellipsis />;

        if (totalPages <= 10) {
            for (let page = 1; page <= totalPages; page++) {
                pageItems.push(
                    <Pagination.Item
                        key={page}
                        active={page === currentPage}
                        onClick={() => handlePageChange(page)}
                    >
                        {page}
                    </Pagination.Item>
                );
            }
        } else {
            const startPage = Math.max(1, currentPage - pageRange);
            const endPage = Math.min(totalPages, currentPage + pageRange);

            if (startPage > 2) {
                pageItems.push(ellipsis);
            }

            for (let page = startPage; page <= endPage; page++) {
                pageItems.push(
                    <Pagination.Item
                        key={page}
                        active={page === currentPage}
                        onClick={() => handlePageChange(page)}
                    >
                        {page}
                    </Pagination.Item>
                );
            }

            if (endPage < totalPages) {
                pageItems.push(ellipsis);
            }
        }

        return pageItems;
    };

    return (
        <Pagination className="m-0">
            <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
            <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
            {renderPaginationItems()}
            <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
            <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
        </Pagination>
    );
};
