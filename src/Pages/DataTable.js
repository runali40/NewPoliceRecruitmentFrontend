import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import 'datatables.net-bs4';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';

const TableComponent = () => {
    const [filterCount, setFilterCount] = useState(1);

    useEffect(() => {
        // Initialize DataTable
        const table = $('#userTable').DataTable({
            dom: '<"top"<"custom-header d-flex justify-content-between align-items-center"<"left d-flex"f><"right">><"custom-filters d-flex justify-content-between align-items-center"<"left d-flex">>rt<"bottom"lp><"clear">',
            language: {
                search: '',
                searchPlaceholder: "Filter by Full Name"
            },
            columns: [
                { data: 'checkbox', orderable: false },
                { data: 'fullName' },
                { data: 'status' },
                { data: 'username' },
                { data: 'lastUpdated' },
            ],
            columnDefs: [
                {
                    targets: 0,
                    render: function (data, type, row, meta) {
                        return '<input type="checkbox">';
                    }
                },
                {
                    targets: 2,
                    render: function (data, type, row, meta) {
                        return '<span class="badge badge-success">' + data + '</span>';
                    }
                },
                {
                    targets: 4,
                    render: function (data, type, row, meta) {
                        return '<i class="far fa-comment mr-2"></i>0 <i class="far fa-heart ml-2"></i>';
                    }
                }
            ],
            select: {
                style: 'multi',
                selector: 'td:first-child'
            },
            order: [[1, 'asc']],
            pageLength: 20,
            lengthMenu: [20, 100, 500, 2500],
            data: [
                { checkbox: '', fullName: 'Runali Kadam', status: 'Active', username: 'kadamrunali40@gmail.com', lastUpdated: '6d', actions: '' },
                { checkbox: '', fullName: 'Amol Bamane', status: 'Active', username: 'abamane@devitinfrasoft.c...', lastUpdated: '6d', actions: '' },
                { checkbox: '', fullName: 'Dev User', status: 'Active', username: 'admin@devitinfrasoft.com', lastUpdated: '1w', actions: '' },
                { checkbox: '', fullName: 'Ashish Joshi', status: 'Active', username: 'ajoshi02795@gmail.com', lastUpdated: '1w', actions: '' },
                { checkbox: '', fullName: 'Administrator', status: 'Active', username: 'administrator@gmail.com', lastUpdated: '1w', actions: '' }
            ],
            initComplete: function () {
                // Add custom elements to the header
                // $('.custom-header .left').prepend(
                //     '<div class="mr-2">ID</div>' +
                //     '<div class="mr-2">Full Name</div>' +
                //     '<div class="mr-2">Username</div>' +
                //     '<div class="mr-2">User Type</div>'
                // );
                $('.custom-header .right').append(
                    '<div class="d-flex align-items-center">' +
                    '<button id="filterButton" class="btn btn-outline-secondary btn-sm mr-2">Filters: ' + filterCount + '</button>' +
                    '<button id="closeFilter" class="btn btn-outline-secondary btn-sm mr-2">×</button>' +
                    '<div class="mr-2">Last Updated On</div>' +
                    '<button id="refreshTable" class="btn btn-outline-secondary btn-sm"><i class="fas fa-sync-alt"></i></button>' +
                    '</div>'
                );

                // Add custom filter row
                // $('.custom-filters .left').append(
                //     '<div class="mr-2">Full Name</div>' +
                //     '<div class="mr-2">Status</div>' +
                //     '<div class="mr-2">ID</div>' +
                //     '<div>5 of 5 <i class="far fa-heart"></i></div>'
                // );

                // Custom filter functionality
                $('#filterButton').on('click', function() {
                    $('.custom-filters').toggle();
                });

                $('#closeFilter').on('click', function() {
                    $('.custom-filters').hide();
                });
            }
        });

        // Custom filter for Full Name
        $('.dataTables_filter input').on('keyup change', function () {
            table.search(this.value).draw();
        });
    }, [filterCount]);

    return (
        <>
            <style>
                {`
                .container-fluid { max-width: 1200px; margin: auto; }
                .card { border: none; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
                .card-body { padding: 0; }
                .table { margin-bottom: 0; width: 100%; }
                .table thead th { border-top: 1px solid #dee2e6; background-color: #f8f9fa; }
                .table tbody td { border-top: 1px solid #dee2e6; }
                .badge-success { background-color: #28a745; color: white; padding: 5px 10px; border-radius: 5px; }
                .dataTables_wrapper .dataTables_filter { display: flex; align-items: center; }
                .dataTables_wrapper .dataTables_filter input { width: 200px; margin-right: 10px; border: none; border-bottom: 1px solid #dee2e6; }
                .dataTables_wrapper .dataTables_length { margin-top: 10px; }
                .custom-header, .custom-filters { padding: 10px; background-color: #f8f9fa; border-bottom: 1px solid #dee2e6; }
                .custom-filters { display: none; }
                #filterButton, #closeFilter, #refreshTable { font-size: 12px; }
                .fa-heart, .fa-comment { color: #6c757d; }
                .fa-heart:hover, .fa-comment:hover { color: #007bff; }
                `}
            </style>
            <div className="container-fluid mt-5">
                <div className="card">
                    <div className="card-body">
                        <div className="table-responsive">
                            <table id="userTable" className="table table-hover">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Full Name</th>
                                        <th>Status</th>
                                        <th>Username</th>
                                        <th>Last Updated On</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Add tbody to ensure proper table structure */}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TableComponent;
