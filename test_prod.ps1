# Test multiple endpoints to diagnose
$base = 'https://todoapp-backend-qjrb.onrender.com'
$endpoints = @('/api/todos', '/', '/health')

foreach ($ep in $endpoints) {
    try {
        $resp = Invoke-WebRequest -Uri ($base + $ep) -TimeoutSec 10 -UseBasicParsing -ErrorAction Stop
        Write-Host ("OK  " + $ep + " -> HTTP " + $resp.StatusCode)
    } catch [System.Net.WebException] {
        $code = [int]$_.Exception.Response.StatusCode
        Write-Host ("ERR " + $ep + " -> HTTP " + $code)
    } catch {
        Write-Host ("TMO " + $ep + " -> " + $_.Exception.Message.Substring(0, [Math]::Min(60, $_.Exception.Message.Length)))
    }
}
