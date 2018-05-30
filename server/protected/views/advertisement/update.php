<?php
/* @var $this AdvertisementController */
/* @var $model Advertisement */

$this->breadcrumbs=array(
	'Advertisements'=>array('index'),
	$model->id=>array('view','id'=>$model->id),
	'Update',
);

$this->menu=array(
	array('label'=>'List Advertisement', 'url'=>array('index')),
	array('label'=>'Create Advertisement', 'url'=>array('create')),
	array('label'=>'View Advertisement', 'url'=>array('view', 'id'=>$model->id)),
	array('label'=>'Manage Advertisement', 'url'=>array('admin')),
);
?>

<h1>Update Advertisement <?php echo $model->id; ?></h1>

<?php $this->renderPartial('_form', array('model'=>$model)); ?>