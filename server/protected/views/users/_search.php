<?php
/* @var $this UsersController */
/* @var $model Users */
/* @var $form CActiveForm */
?>

<div class="wide form">

<?php $form=$this->beginWidget('CActiveForm', array(
	'action'=>Yii::app()->createUrl($this->route),
	'method'=>'get',
)); ?>

	<div class="row">
		<?php echo $form->label($model,'user_id'); ?>
		<?php echo $form->textField($model,'user_id'); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'sex_id'); ?>
		<?php echo $form->textField($model,'sex_id'); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'skin_id'); ?>
		<?php echo $form->textField($model,'skin_id'); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'buyer_id'); ?>
		<?php echo $form->textField($model,'buyer_id'); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'grave_id'); ?>
		<?php echo $form->textField($model,'grave_id'); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'country_id'); ?>
		<?php echo $form->textField($model,'country_id'); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'country_d_id'); ?>
		<?php echo $form->textField($model,'country_d_id'); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'profession_id'); ?>
		<?php echo $form->textField($model,'profession_id'); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'religion_id'); ?>
		<?php echo $form->textField($model,'religion_id'); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'religion_name'); ?>
		<?php echo $form->textField($model,'religion_name',array('size'=>60,'maxlength'=>200)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'graveyard_id'); ?>
		<?php echo $form->textField($model,'graveyard_id'); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'place_id'); ?>
		<?php echo $form->textField($model,'place_id'); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'name1'); ?>
		<?php echo $form->textArea($model,'name1',array('rows'=>6, 'cols'=>50)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'name2'); ?>
		<?php echo $form->textField($model,'name2',array('size'=>60,'maxlength'=>200)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'name3'); ?>
		<?php echo $form->textField($model,'name3',array('size'=>60,'maxlength'=>200)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'surname'); ?>
		<?php echo $form->textField($model,'surname',array('size'=>60,'maxlength'=>200)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'surname_desc'); ?>
		<?php echo $form->textField($model,'surname_desc',array('size'=>60,'maxlength'=>200)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'surname_other'); ?>
		<?php echo $form->textField($model,'surname_other',array('size'=>60,'maxlength'=>200)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'gender'); ?>
		<?php echo $form->textField($model,'gender'); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'ex_wife1'); ?>
		<?php echo $form->textArea($model,'ex_wife1',array('rows'=>6, 'cols'=>50)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'ex_wife2'); ?>
		<?php echo $form->textField($model,'ex_wife2',array('size'=>60,'maxlength'=>200)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'ex_wife3'); ?>
		<?php echo $form->textField($model,'ex_wife3',array('size'=>60,'maxlength'=>200)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'maiden_name'); ?>
		<?php echo $form->textField($model,'maiden_name',array('size'=>60,'maxlength'=>200)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'nickname'); ?>
		<?php echo $form->textField($model,'nickname',array('size'=>60,'maxlength'=>200)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'father_name'); ?>
		<?php echo $form->textField($model,'father_name',array('size'=>60,'maxlength'=>200)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'mother_name'); ?>
		<?php echo $form->textField($model,'mother_name',array('size'=>60,'maxlength'=>200)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'childrens_names'); ?>
		<?php echo $form->textArea($model,'childrens_names',array('rows'=>6, 'cols'=>50)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'date_birth'); ?>
		<?php echo $form->textField($model,'date_birth'); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'place_birth'); ?>
		<?php echo $form->textField($model,'place_birth',array('size'=>60,'maxlength'=>200)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'cityname_now'); ?>
		<?php echo $form->textField($model,'cityname_now',array('size'=>60,'maxlength'=>200)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'cityname_history'); ?>
		<?php echo $form->textField($model,'cityname_history',array('size'=>60,'maxlength'=>200)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'date_death'); ?>
		<?php echo $form->textField($model,'date_death'); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'place_death'); ?>
		<?php echo $form->textField($model,'place_death',array('size'=>60,'maxlength'=>200)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'death_reason'); ?>
		<?php echo $form->textField($model,'death_reason',array('size'=>60,'maxlength'=>200)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'cityname_death_now'); ?>
		<?php echo $form->textField($model,'cityname_death_now',array('size'=>60,'maxlength'=>250)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'cityname_death_history'); ?>
		<?php echo $form->textField($model,'cityname_death_history',array('size'=>60,'maxlength'=>250)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'crest'); ?>
		<?php echo $form->textField($model,'crest',array('size'=>60,'maxlength'=>200)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'crest_url'); ?>
		<?php echo $form->textField($model,'crest_url',array('size'=>60,'maxlength'=>200)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'other_professions'); ?>
		<?php echo $form->textArea($model,'other_professions',array('rows'=>6, 'cols'=>50)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'functions'); ?>
		<?php echo $form->textArea($model,'functions',array('rows'=>6, 'cols'=>50)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'live_history'); ?>
		<?php echo $form->textArea($model,'live_history',array('rows'=>6, 'cols'=>50)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'father_id'); ?>
		<?php echo $form->textField($model,'father_id'); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'mother_id'); ?>
		<?php echo $form->textField($model,'mother_id'); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'hobby'); ?>
		<?php echo $form->textArea($model,'hobby',array('rows'=>6, 'cols'=>50)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'pic_url'); ?>
		<?php echo $form->textField($model,'pic_url',array('size'=>60,'maxlength'=>200)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'is_deleted'); ?>
		<?php echo $form->textField($model,'is_deleted'); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'c_birth'); ?>
		<?php echo $form->textField($model,'c_birth',array('size'=>2,'maxlength'=>2)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'c_death'); ?>
		<?php echo $form->textField($model,'c_death',array('size'=>2,'maxlength'=>2)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'country_birth'); ?>
		<?php echo $form->textField($model,'country_birth',array('size'=>60,'maxlength'=>200)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'country_death'); ?>
		<?php echo $form->textField($model,'country_death',array('size'=>60,'maxlength'=>200)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'grave_image'); ?>
		<?php echo $form->textField($model,'grave_image',array('size'=>60,'maxlength'=>200)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'hobbyids'); ?>
		<?php echo $form->textField($model,'hobbyids'); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'flash_data'); ?>
		<?php echo $form->textArea($model,'flash_data',array('rows'=>6, 'cols'=>50)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'uniq_id'); ?>
		<?php echo $form->textField($model,'uniq_id',array('size'=>60,'maxlength'=>128)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'pay_method'); ?>
		<?php echo $form->textField($model,'pay_method',array('size'=>16,'maxlength'=>16)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'paymentid'); ?>
		<?php echo $form->textField($model,'paymentid'); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'amount'); ?>
		<?php echo $form->textField($model,'amount',array('size'=>16,'maxlength'=>16)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'add_date'); ?>
		<?php echo $form->textField($model,'add_date'); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'language'); ?>
		<?php echo $form->textField($model,'language',array('size'=>2,'maxlength'=>2)); ?>
	</div>

	<div class="row buttons">
		<?php echo CHtml::submitButton('Search'); ?>
	</div>

<?php $this->endWidget(); ?>

</div><!-- search-form -->