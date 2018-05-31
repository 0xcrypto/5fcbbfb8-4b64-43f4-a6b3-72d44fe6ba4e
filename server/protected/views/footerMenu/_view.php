<?php
/* @var $this FooterMenuController */
/* @var $data FooterMenu */
?>

<div class="view">

	<b><?php echo CHtml::encode($data->getAttributeLabel('id')); ?>:</b>
	<?php echo CHtml::link(CHtml::encode($data->id), array('view', 'id'=>$data->id)); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('text_en')); ?>:</b>
	<?php echo CHtml::encode($data->text_en); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('text_pl')); ?>:</b>
	<?php echo CHtml::encode($data->text_pl); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('comp_name')); ?>:</b>
	<?php echo CHtml::encode($data->comp_name); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('comp_params')); ?>:</b>
	<?php echo CHtml::encode($data->comp_params); ?>
	<br />


</div>