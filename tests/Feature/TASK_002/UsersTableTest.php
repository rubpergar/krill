<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;

uses(RefreshDatabase::class);

test('users table has rol and activo columns', function () {
    expect(Schema::hasColumn('users', 'rol'))->toBeTrue();
    expect(Schema::hasColumn('users', 'activo'))->toBeTrue();
});
