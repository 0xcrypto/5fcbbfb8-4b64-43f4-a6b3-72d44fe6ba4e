<?php
/* @var $this FooterMenuController */
/* @var $dataProvider CActiveDataProvider */

$this->breadcrumbs=array(
	'Footer Menus',
);

$this->menu=array(
	array('label'=>'Create FooterMenu', 'url'=>array('create')),
	array('label'=>'Manage FooterMenu', 'url'=>array('admin')),
);
?>

<h1>Footer Menus</h1>

<?php $this->widget('zii.widgets.CListView', array(
	'dataProvider'=>$dataProvider,
	'itemView'=>'_view',
)); ?>
