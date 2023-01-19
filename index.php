<?php
// Read package version so we can include built js and css
$pkg = json_decode(file_get_contents('package.json'));
$version = $pkg->version;
?><!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=0">
    <title>Frontend boilerplate</title>
    <link rel="stylesheet" href="build/app.min-<?php echo $version ?>.css" type='text/css' media='all' />
</head>
<body>
    <h1>State</h1>
    <form method="post" action="">
        <input type="text" name="number" />
        <button type="submit">Send</button>
    </form>
    <script src="build/app.min-<?php echo $version ?>.js"></script>
</body>
</html>