<?php
/* @var $this FooterMenuController */
/* @var $model FooterMenu */

$this->breadcrumbs=array(
	'Footer Menus'=>array('index'),
	$model->id,
);

$this->menu=array(
	array('label'=>'List FooterMenu', 'url'=>array('index')),
	array('label'=>'Create FooterMenu', 'url'=>array('create')),
	array('label'=>'Update FooterMenu', 'url'=>array('update', 'id'=>$model->id)),
	array('label'=>'Delete FooterMenu', 'url'=>'#', 'linkOptions'=>array('submit'=>array('delete','id'=>$model->id),'confirm'=>'Are you sure you want to delete this item?')),
	array('label'=>'Manage FooterMenu', 'url'=>array('admin')),
);
?>

<h1>View FooterMenu #<?php echo $model->id; ?></h1>

<?php $this->widget('zii.widgets.CDetailView', array(
	'data'=>$model,
	'attributes'=>array(
		'id',
		'text_en',
		'text_pl',
		'comp_name',
		'comp_params',
	),
)); ?>
