<?php
/* @var $this AdvertisementController */
/* @var $model Advertisement */

$this->breadcrumbs=array(
	'Advertisements'=>array('index'),
	'Create',
);

$this->menu=array(
	array('label'=>'List Advertisement', 'url'=>array('index')),
	array('label'=>'Manage Advertisement', 'url'=>array('admin')),
);
?>

<h1>Create Advertisement</h1>

<?php $this->renderPartial('_form', array('model'=>$model)); ?>