<?php return array (
  'application' => 
  array (
    'debug' => true,
  ),
  'database' => 
  array (
    'default' => 'mysql',
    'connections' => 
    array (
      'mysql' => 
      array (
        'dbname' => 'erp_db',
        'host' => 'localhost',
        'user' => 'root',
        'prefix' => 'cf_',
        'password' => '1234',
      ),
    ),
  ),
  'system' => 
  array (
    'secret' => 'bWaQG8dfl8OzIi7HRsGkQKlJuafMCbvRFxtb.gFnzKLUIEIce7MoUHqzg5iJxxTC',
  ),
  'system/cache' => 
  array (
    'caches' => 
    array (
      'cache' => 
      array (
        'storage' => 'auto',
      ),
    ),
    'nocache' => false,
  ),
  'system/finder' => 
  array (
    'storage' => '',
  ),
  'debug' => 
  array (
    'enabled' => true,
  ),
);