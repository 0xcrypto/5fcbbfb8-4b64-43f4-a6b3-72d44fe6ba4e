<?php
/* @var $this AdvertisementController */
/* @var $model Advertisement */
/* @var $form CActiveForm */
?>

<div class="form">

<?php $form=$this->beginWidget('CActiveForm', array(
	'id'=>'advertisement-form',
	// Please note: When you enable ajax validation, make sure the corresponding
	// controller action is handling ajax validation correctly.
	// There is a call to performAjaxValidation() commented in generated controller code.
	// See class documentation of CActiveForm for details on this.
	'enableAjaxValidation'=>false,
)); ?>

	<p class="note">Fields with <span class="required">*</span> are required.</p>

	<?php echo $form->errorSummary($model); ?>

	<div class="row">
		<?php echo $form->labelEx($model,'image'); ?>
		<?php echo $form->textField($model,'image',array('size'=>60,'maxlength'=>200)); ?>
		<?php echo $form->error($model,'image'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'url'); ?>
		<?php echo $form->textField($model,'url',array('size'=>60,'maxlength'=>200)); ?>
		<?php echo $form->error($model,'url'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'text'); ?>
		<?php echo $form->textField($model,'text',array('size'=>60,'maxlength'=>500)); ?>
		<?php echo $form->error($model,'text'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'priority'); ?>
		<?php echo $form->textField($model,'priority'); ?>
		<?php echo $form->error($model,'priority'); ?>
	</div>

	<div class="row buttons">
		<?php echo CHtml::submitButton($model->isNewRecord ? 'Create' : 'Save'); ?>
	</div>

<?php $this->endWidget(); ?>

</div><!-- form -->