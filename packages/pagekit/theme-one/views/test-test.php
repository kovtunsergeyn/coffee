<?php
use Pagekit\Application;

$result = Application::db()->createQueryBuilder()->select('*')->from('@blog_post')->where('id = :id', ['id' => 1])->execute();

$row = $result->fetch();
print $row['content']; 

include 'view_templates/test_template.html.php';

?>