<!doctype html>
<html lang="en" dir="ltr">

<head>
    <meta charset="utf-8" />
    <link rel="icon" href="{{ asset('unv.png') }}" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Projects</title>

    <!-- Bootstrap -->
    <link href="{{ asset('css/bootstrap.min.css') }}" rel="stylesheet">

    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

    <!-- Dashboard CSS -->
    <link href="{{ asset('css/dashboard.css') }}" rel="stylesheet">

    <!-- React build CSS -->
    <link href="{{ asset('build/static/css/main.491f59c2.css') }}" rel="stylesheet">
</head>

<body role="document">

    <div id="root">
        <div class="loading-spinner" style="text-align: center; padding: 50px;">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Loading application...</p>
        </div>
    </div>

    <!-- React API Environment Variables -->
    <script>
        window.REACT_APP_API_URL = "{{ env('REACT_APP_API_URL', 'https://tenders.just.sd/public/index.php/api') }}";
        window.PUBLIC_URL = "{{ env('PUBLIC_URL', 'https://tenders.just.sd/public') }}";
        window.CSRF_TOKEN = "{{ csrf_token() }}";
    </script>

    <!-- jQuery + Bootstrap JS -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <script src="{{ asset('js/bootstrap.min.js') }}"></script>

    <!-- React build JS -->
    <script src="{{ asset('build/static/js/main.ffbaaf18.js') }}"></script>

</body>

</html>