<?php
/* @var $this StaticPageController */
/* @var $dataProvider CActiveDataProvider */

$this->breadcrumbs=array(
	'Static Pages',
);

$this->menu=array(
	array('label'=>'Create StaticPage', 'url'=>array('create')),
	array('label'=>'Manage StaticPage', 'url'=>array('admin')),
);
?>

<h1>Static Pages</h1>

<?php $this->widget('zii.widgets.CListView', array(
	'dataProvider'=>$dataProvider,
	'itemView'=>'_view',
)); ?>
