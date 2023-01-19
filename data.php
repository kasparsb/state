<?php
header('content-type: application/json');

switch (filter_input(INPUT_GET, 'action')) {
    case 'invoices':
        echo json_encode([
            [
                'id' => 1,
                'number' => 'jas1',
            ],
            [
                'id' => 2,
                'number' => '6767',
            ],
            [
                'id' => 3,
                'number' => 'klsdf',
            ],
        ]);
}