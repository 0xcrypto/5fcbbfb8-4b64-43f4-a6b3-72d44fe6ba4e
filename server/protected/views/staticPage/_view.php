<?php
/* @var $this StaticPageController */
/* @var $data StaticPage */
?>

<div class="view">

	<b><?php echo CHtml::encode($data->getAttributeLabel('id')); ?>:</b>
	<?php echo CHtml::link(CHtml::encode($data->id), array('view', 'id'=>$data->id)); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('title')); ?>:</b>
	<?php echo CHtml::encode($data->title); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('heading')); ?>:</b>
	<?php echo CHtml::encode($data->heading); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('body_en')); ?>:</b>
	<?php echo CHtml::encode($data->body_en); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('body_pl')); ?>:</b>
	<?php echo CHtml::encode($data->body_pl); ?>
	<br />


</div>