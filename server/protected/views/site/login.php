<div class="container-fluid">
	<?php $form=$this->beginWidget('CActiveForm', array(
		'enableClientValidation'=>true,
		'clientOptions'=>array(
			'validateOnSubmit'=>true,
		),
		'htmlOptions'=>array(
			'class'=>'sign-box',
		)
	)); ?>
	<form class="">
		<div class="sign-avatar">
			<img src="img/avatar-sign.png" alt="">
		</div>
		<header class="sign-title">Sign In</header>
		<div class="form-group">
		   <?php echo $form->textField($model,'user_name', array('class'=>'form-control', 'placeholder'=>'Username')); ?> 
		</div>
		<div class="form-group">
			<?php echo $form->passwordField($model,'user_password', array('class'=>'form-control', 'placeholder'=>'Password')); ?>
		</div>
		<div class="form-group">
			<div class="checkbox float-left">
				<?php echo $form->checkBox($model,'rememberMe', array('id'=>'signed-in')); ?>
				<label for="signed-in">Keep me signed in</label>
			</div>
		</div>
		<?php echo CHtml::submitButton('Sign in', array('class'=>'btn btn-rounded')); ?>
	<?php $this->endWidget(); ?>
</div>

