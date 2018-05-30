<?php
/* @var $this AdvertisementController */
/* @var $dataProvider CActiveDataProvider */

$this->breadcrumbs=array(
	'Advertisements',
);

$this->menu=array(
	array('label'=>'Create Advertisement', 'url'=>array('create')),
	array('label'=>'Manage Advertisement', 'url'=>array('admin')),
);
?>

<h1>Advertisements</h1>

<?php $this->widget('zii.widgets.CListView', array(
	'dataProvider'=>$dataProvider,
	'itemView'=>'_view',
)); ?>
