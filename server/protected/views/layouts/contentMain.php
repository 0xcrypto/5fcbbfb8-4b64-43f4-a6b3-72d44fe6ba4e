<!DOCTYPE html>
<html>
<head lang="en">
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
	<meta http-equiv="x-ua-compatible" content="ie=edge">
	<title><?php echo CHtml::encode($this->pageTitle); ?></title>

	<link href="<?php echo Yii::app()->request->baseUrl; ?>/img/favicon.144x144.png" rel="apple-touch-icon" type="image/png" sizes="144x144">
	<link href="<?php echo Yii::app()->request->baseUrl; ?>/img/favicon.114x114.png" rel="apple-touch-icon" type="image/png" sizes="114x114">
	<link href="<?php echo Yii::app()->request->baseUrl; ?>/img/favicon.72x72.png" rel="apple-touch-icon" type="image/png" sizes="72x72">
	<link href="<?php echo Yii::app()->request->baseUrl; ?>/img/favicon.57x57.png" rel="apple-touch-icon" type="image/png">
	<link href="<?php echo Yii::app()->request->baseUrl; ?>/img/favicon.png" rel="icon" type="image/png">
	<link href="<?php echo Yii::app()->request->baseUrl; ?>/img/favicon.ico" rel="shortcut icon">

	<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
	<!--[if lt IE 9]>
	<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
	<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
	<![endif]-->
	<link rel="stylesheet" href="<?php echo Yii::app()->request->baseUrl; ?>/css/lib/lobipanel/lobipanel.min.css">
	<link rel="stylesheet" href="<?php echo Yii::app()->request->baseUrl; ?>/css/separate/vendor/lobipanel.min.css">
	<link rel="stylesheet" href="<?php echo Yii::app()->request->baseUrl; ?>/css/lib/jqueryui/jquery-ui.min.css">
	<link rel="stylesheet" href="<?php echo Yii::app()->request->baseUrl; ?>/css/separate/pages/widgets.min.css">
	<link rel="stylesheet" href="<?php echo Yii::app()->request->baseUrl; ?>/css/lib/font-awesome/font-awesome.min.css">
	<link rel="stylesheet" href="<?php echo Yii::app()->request->baseUrl; ?>/css/lib/bootstrap/bootstrap.min.css">
	<link rel="stylesheet" href="<?php echo Yii::app()->request->baseUrl; ?>/css/lib/datatables-net/datatables.min.css">
	<link rel="stylesheet" href="<?php echo Yii::app()->request->baseUrl; ?>/css/separate/vendor/datatables-net.min.css">
	<link rel="stylesheet" href="<?php echo Yii::app()->request->baseUrl; ?>/css/main.css">
	<link rel="stylesheet" href="<?php echo Yii::app()->request->baseUrl; ?>/css/lib/bootstrap-sweetalert/sweetalert.css">
	<link rel="stylesheet" href="<?php echo Yii::app()->request->baseUrl; ?>/css/separate/vendor/sweet-alert-animations.min.css">
</head>
<body class="with-side-menu control-panel control-panel-compact">
	<header class="site-header">
	    <div class="container-fluid">
	
	        <a href="#" class="site-logo">
	            <h1></h1>
	            <!--<img class="hidden-lg-up" src="img/logo-2-mob.png" alt="">-->
	        </a>
	
	        <button id="show-hide-sidebar-toggle" class="show-hide-sidebar">
	            <span>toggle menu</span>
	        </button>
	
	        <button class="hamburger hamburger--htla">
	            <span>toggle menu</span>
	        </button>
	        <div class="site-header-content">
	            <div class="site-header-content-in">
					<span style="margin-top: 5px;display: inline-block;">_NAME_</span>
	                <div class="site-header-shown">
	                    <div class="dropdown user-menu">
	                        <button class="dropdown-toggle" id="dd-user-menu" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
	                            <img src="img/avatar-sign.png" alt="">
	                        </button>
	                        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dd-user-menu">
								<a class="dropdown-item" href="<?php echo Yii::app()->createUrl('site/logout');?>"><span class="font-icon glyphicon glyphicon-log-out"></span>Logout</a>
	                        </div>
	                    </div>
	
	                    <!--<button type="button" class="burger-right">
	                        <i class="font-icon-menu-addl"></i>
	                    </button>-->
	                </div><!--.site-header-shown-->
	
	                <div class="mobile-menu-right-overlay"></div>
	            </div><!--site-header-content-in-->
	        </div><!--.site-header-content-->
	    </div><!--.container-fluid-->
	</header>

	<div class="mobile-menu-left-overlay"></div>
	<nav class="side-menu">
	    <ul class="side-menu-list">
	        <li class="grey with-sub">
	            <span>
	                <i class="font-icon font-icon-dashboard"></i>
	                <span class="lbl">Users</span>
	            </span>
	            <ul>
	                <li><a href="<?php echo Yii::app()->createUrl('Users/admin');?>"><span class="lbl">Users</span></a></li>
	            </ul>
	        </li>
	        <li class="grey with-sub">
	            <span>
	                <i class="font-icon font-icon-dashboard"></i>
	                <span class="lbl">Static Pages</span>
	            </span>
	            <ul>
	                <li><a href="<?php echo Yii::app()->createUrl('StaticPage/admin');?>"><span class="lbl">Static Pages</span></a></li>
	            </ul>
	        </li>
	        <li class="grey with-sub">
	            <span>
	                <i class="font-icon font-icon-dashboard"></i>
	                <span class="lbl">Footer</span>
	            </span>
	            <ul>
	                <li><a href="<?php echo Yii::app()->createUrl('FooterMenu/admin');?>"><span class="lbl">Menus</span></a></li>
	            </ul>
	        </li>
		</ul>
	</nav>
	<div class="page-content">
		<?php echo $content; ?>
	</div>
<script src="<?php echo Yii::app()->request->baseUrl; ?>/js/lib/jquery/jquery.min.js"></script>
<script src="<?php echo Yii::app()->request->baseUrl; ?>/js/lib/datatables-net/datatables.min.js"></script>
<script src="<?php echo Yii::app()->request->baseUrl; ?>/js/lib/tether/tether.min.js"></script>
<script src="<?php echo Yii::app()->request->baseUrl; ?>/js/lib/bootstrap/bootstrap.min.js"></script>
<script src="<?php echo Yii::app()->request->baseUrl; ?>/js/plugins.js"></script>

<script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/js/lib/jqueryui/jquery-ui.min.js"></script>
<script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/js/lib/lobipanel/lobipanel.min.js"></script>
<script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/js/lib/match-height/jquery.matchHeight.min.js"></script>
<script src="<?php echo Yii::app()->request->baseUrl; ?>/js/lib/bootstrap-sweetalert/sweetalert.min.js"></script>
<script>
	$(document).ready(function() {
		$('.panel').lobiPanel({
			sortable: true
		});
		$('.panel').on('dragged.lobiPanel', function(ev, lobiPanel){
			$('.dahsboard-column').matchHeight();
		});
	});
</script>
<script src="<?php echo Yii::app()->request->baseUrl; ?>/js/app.js"></script>

</body>
</html>
