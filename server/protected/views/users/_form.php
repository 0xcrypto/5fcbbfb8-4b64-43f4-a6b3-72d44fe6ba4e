<?php
/* @var $this UsersController */
/* @var $model Users */
/* @var $form CActiveForm */
?>

<div class="form">

<?php $form=$this->beginWidget('CActiveForm', array(
	'id'=>'users-form',
	// Please note: When you enable ajax validation, make sure the corresponding
	// controller action is handling ajax validation correctly.
	// There is a call to performAjaxValidation() commented in generated controller code.
	// See class documentation of CActiveForm for details on this.
	'enableAjaxValidation'=>false,
)); ?>

	<p class="note">Fields with <span class="required">*</span> are required.</p>

	<?php echo $form->errorSummary($model); ?>

	<div class="row">
		<?php echo $form->labelEx($model,'sex_id'); ?>
		<?php echo $form->textField($model,'sex_id'); ?>
		<?php echo $form->error($model,'sex_id'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'skin_id'); ?>
		<?php echo $form->textField($model,'skin_id'); ?>
		<?php echo $form->error($model,'skin_id'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'buyer_id'); ?>
		<?php echo $form->textField($model,'buyer_id'); ?>
		<?php echo $form->error($model,'buyer_id'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'grave_id'); ?>
		<?php echo $form->textField($model,'grave_id'); ?>
		<?php echo $form->error($model,'grave_id'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'country_id'); ?>
		<?php echo $form->textField($model,'country_id'); ?>
		<?php echo $form->error($model,'country_id'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'country_d_id'); ?>
		<?php echo $form->textField($model,'country_d_id'); ?>
		<?php echo $form->error($model,'country_d_id'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'profession_id'); ?>
		<?php echo $form->textField($model,'profession_id'); ?>
		<?php echo $form->error($model,'profession_id'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'religion_id'); ?>
		<?php echo $form->textField($model,'religion_id'); ?>
		<?php echo $form->error($model,'religion_id'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'religion_name'); ?>
		<?php echo $form->textField($model,'religion_name',array('size'=>60,'maxlength'=>200)); ?>
		<?php echo $form->error($model,'religion_name'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'graveyard_id'); ?>
		<?php echo $form->textField($model,'graveyard_id'); ?>
		<?php echo $form->error($model,'graveyard_id'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'place_id'); ?>
		<?php echo $form->textField($model,'place_id'); ?>
		<?php echo $form->error($model,'place_id'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'name1'); ?>
		<?php echo $form->textArea($model,'name1',array('rows'=>6, 'cols'=>50)); ?>
		<?php echo $form->error($model,'name1'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'name2'); ?>
		<?php echo $form->textField($model,'name2',array('size'=>60,'maxlength'=>200)); ?>
		<?php echo $form->error($model,'name2'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'name3'); ?>
		<?php echo $form->textField($model,'name3',array('size'=>60,'maxlength'=>200)); ?>
		<?php echo $form->error($model,'name3'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'surname'); ?>
		<?php echo $form->textField($model,'surname',array('size'=>60,'maxlength'=>200)); ?>
		<?php echo $form->error($model,'surname'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'surname_desc'); ?>
		<?php echo $form->textField($model,'surname_desc',array('size'=>60,'maxlength'=>200)); ?>
		<?php echo $form->error($model,'surname_desc'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'surname_other'); ?>
		<?php echo $form->textField($model,'surname_other',array('size'=>60,'maxlength'=>200)); ?>
		<?php echo $form->error($model,'surname_other'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'gender'); ?>
		<?php echo $form->textField($model,'gender'); ?>
		<?php echo $form->error($model,'gender'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'ex_wife1'); ?>
		<?php echo $form->textArea($model,'ex_wife1',array('rows'=>6, 'cols'=>50)); ?>
		<?php echo $form->error($model,'ex_wife1'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'ex_wife2'); ?>
		<?php echo $form->textField($model,'ex_wife2',array('size'=>60,'maxlength'=>200)); ?>
		<?php echo $form->error($model,'ex_wife2'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'ex_wife3'); ?>
		<?php echo $form->textField($model,'ex_wife3',array('size'=>60,'maxlength'=>200)); ?>
		<?php echo $form->error($model,'ex_wife3'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'maiden_name'); ?>
		<?php echo $form->textField($model,'maiden_name',array('size'=>60,'maxlength'=>200)); ?>
		<?php echo $form->error($model,'maiden_name'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'nickname'); ?>
		<?php echo $form->textField($model,'nickname',array('size'=>60,'maxlength'=>200)); ?>
		<?php echo $form->error($model,'nickname'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'father_name'); ?>
		<?php echo $form->textField($model,'father_name',array('size'=>60,'maxlength'=>200)); ?>
		<?php echo $form->error($model,'father_name'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'mother_name'); ?>
		<?php echo $form->textField($model,'mother_name',array('size'=>60,'maxlength'=>200)); ?>
		<?php echo $form->error($model,'mother_name'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'childrens_names'); ?>
		<?php echo $form->textArea($model,'childrens_names',array('rows'=>6, 'cols'=>50)); ?>
		<?php echo $form->error($model,'childrens_names'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'date_birth'); ?>
		<?php echo $form->textField($model,'date_birth'); ?>
		<?php echo $form->error($model,'date_birth'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'place_birth'); ?>
		<?php echo $form->textField($model,'place_birth',array('size'=>60,'maxlength'=>200)); ?>
		<?php echo $form->error($model,'place_birth'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'cityname_now'); ?>
		<?php echo $form->textField($model,'cityname_now',array('size'=>60,'maxlength'=>200)); ?>
		<?php echo $form->error($model,'cityname_now'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'cityname_history'); ?>
		<?php echo $form->textField($model,'cityname_history',array('size'=>60,'maxlength'=>200)); ?>
		<?php echo $form->error($model,'cityname_history'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'date_death'); ?>
		<?php echo $form->textField($model,'date_death'); ?>
		<?php echo $form->error($model,'date_death'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'place_death'); ?>
		<?php echo $form->textField($model,'place_death',array('size'=>60,'maxlength'=>200)); ?>
		<?php echo $form->error($model,'place_death'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'death_reason'); ?>
		<?php echo $form->textField($model,'death_reason',array('size'=>60,'maxlength'=>200)); ?>
		<?php echo $form->error($model,'death_reason'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'cityname_death_now'); ?>
		<?php echo $form->textField($model,'cityname_death_now',array('size'=>60,'maxlength'=>250)); ?>
		<?php echo $form->error($model,'cityname_death_now'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'cityname_death_history'); ?>
		<?php echo $form->textField($model,'cityname_death_history',array('size'=>60,'maxlength'=>250)); ?>
		<?php echo $form->error($model,'cityname_death_history'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'crest'); ?>
		<?php echo $form->textField($model,'crest',array('size'=>60,'maxlength'=>200)); ?>
		<?php echo $form->error($model,'crest'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'crest_url'); ?>
		<?php echo $form->textField($model,'crest_url',array('size'=>60,'maxlength'=>200)); ?>
		<?php echo $form->error($model,'crest_url'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'other_professions'); ?>
		<?php echo $form->textArea($model,'other_professions',array('rows'=>6, 'cols'=>50)); ?>
		<?php echo $form->error($model,'other_professions'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'functions'); ?>
		<?php echo $form->textArea($model,'functions',array('rows'=>6, 'cols'=>50)); ?>
		<?php echo $form->error($model,'functions'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'live_history'); ?>
		<?php echo $form->textArea($model,'live_history',array('rows'=>6, 'cols'=>50)); ?>
		<?php echo $form->error($model,'live_history'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'father_id'); ?>
		<?php echo $form->textField($model,'father_id'); ?>
		<?php echo $form->error($model,'father_id'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'mother_id'); ?>
		<?php echo $form->textField($model,'mother_id'); ?>
		<?php echo $form->error($model,'mother_id'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'hobby'); ?>
		<?php echo $form->textArea($model,'hobby',array('rows'=>6, 'cols'=>50)); ?>
		<?php echo $form->error($model,'hobby'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'pic_url'); ?>
		<?php echo $form->textField($model,'pic_url',array('size'=>60,'maxlength'=>200)); ?>
		<?php echo $form->error($model,'pic_url'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'is_deleted'); ?>
		<?php echo $form->textField($model,'is_deleted'); ?>
		<?php echo $form->error($model,'is_deleted'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'c_birth'); ?>
		<?php echo $form->textField($model,'c_birth',array('size'=>2,'maxlength'=>2)); ?>
		<?php echo $form->error($model,'c_birth'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'c_death'); ?>
		<?php echo $form->textField($model,'c_death',array('size'=>2,'maxlength'=>2)); ?>
		<?php echo $form->error($model,'c_death'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'country_birth'); ?>
		<?php echo $form->textField($model,'country_birth',array('size'=>60,'maxlength'=>200)); ?>
		<?php echo $form->error($model,'country_birth'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'country_death'); ?>
		<?php echo $form->textField($model,'country_death',array('size'=>60,'maxlength'=>200)); ?>
		<?php echo $form->error($model,'country_death'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'grave_image'); ?>
		<?php echo $form->textField($model,'grave_image',array('size'=>60,'maxlength'=>200)); ?>
		<?php echo $form->error($model,'grave_image'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'hobbyids'); ?>
		<?php echo $form->textField($model,'hobbyids'); ?>
		<?php echo $form->error($model,'hobbyids'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'flash_data'); ?>
		<?php echo $form->textArea($model,'flash_data',array('rows'=>6, 'cols'=>50)); ?>
		<?php echo $form->error($model,'flash_data'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'uniq_id'); ?>
		<?php echo $form->textField($model,'uniq_id',array('size'=>60,'maxlength'=>128)); ?>
		<?php echo $form->error($model,'uniq_id'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'pay_method'); ?>
		<?php echo $form->textField($model,'pay_method',array('size'=>16,'maxlength'=>16)); ?>
		<?php echo $form->error($model,'pay_method'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'paymentid'); ?>
		<?php echo $form->textField($model,'paymentid'); ?>
		<?php echo $form->error($model,'paymentid'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'amount'); ?>
		<?php echo $form->textField($model,'amount',array('size'=>16,'maxlength'=>16)); ?>
		<?php echo $form->error($model,'amount'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'add_date'); ?>
		<?php echo $form->textField($model,'add_date'); ?>
		<?php echo $form->error($model,'add_date'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'language'); ?>
		<?php echo $form->textField($model,'language',array('size'=>2,'maxlength'=>2)); ?>
		<?php echo $form->error($model,'language'); ?>
	</div>

	<div class="row buttons">
		<?php echo CHtml::submitButton($model->isNewRecord ? 'Create' : 'Save'); ?>
	</div>

<?php $this->endWidget(); ?>

</div><!-- form -->